import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { parseAllDocuments } from 'yaml'
import TonWeb from 'tonweb';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const CONTRACT_TYPES = [
    'wallet',
    'nft_collection',
    'jetton',
    'pool',
];

const YAML_DIRECTORY = './source/';
const BUILD_DIRECTORY = './build/';
const AVATARS_DIRECTORY = './avatars/';
const IMG_DIRECTORY = './build/img/';

/**
 * @param  {String} address
 * @param  {Boolean} options.bounceable
 * @return {String}
 */
const canonizeAddress = function anyAddressToFriendly(address, { bounceable }) {
    return new TonWeb.utils.Address(address).toString(true, true, bounceable, false);
};

/**
 * @param  {String} address
 * @return {String}
 */
const canonizeAddressToRaw = function anyAddressToRaw(address) {
    return new TonWeb.utils.Address(address).toString(false);
};

/**
 * @param  {Object} entry
 * @return {Boolean}
 */
const validate = function checkThatEveryEntryHasValidAddressAndMetaFields(entry) {
    try {
        new TonWeb.utils.Address(entry.address);
    } catch {
        throw new Error(`[${entry.filename}] Invalid address: ${entry.address}`);
    }

    if (entry.filename !== 'scam.yaml' && (entry.name || '').length <= 2) {
        throw new Error(
            `[${entry.filename}] Name for ${entry.address} must be at least 2 symbols length, ` +
            `given name: ${entry.name}`
        );
    }

    if (entry.type !== undefined && !CONTRACT_TYPES.includes(entry.type)) {
        throw new Error(
            `[${entry.filename}] Contract type for ${entry.address} must be ` +
            `either undefined or one of: ${CONTRACT_TYPES.join(', ')}, given: ${entry.type}`
        );
    }

    return true;
};

/**
 * @param  {String} directory
 * @return {Promise<Map>}
 */
const createAddressbook = async function parseDirectoryAndCreateAddressBookFromYamlFiles(directory = YAML_DIRECTORY) {
    const yamls = (await readdir(directory))
        .filter(file => file.endsWith('.yaml'))
        .map(file => [ file, readFile(`${directory}${file}`, 'utf8') ]);

    const addrbook = new Map;
    const addresses = new Map;

    for (const [filename, getContents] of yamls) {
        parseAllDocuments(await getContents)
            .flatMap(document => document.toJS())
            .map(document => ({ ...document, filename }))
            .filter(validate)
            .forEach(({ address, name, tonIcon, isScam, type }) => {
                const raw = canonizeAddressToRaw(address);

                if (addresses.has(raw)) {
                    throw new Error(`[${filename}] Address ${address} is already defined in ${addresses.get(raw)}`);
                }

                addresses.set(raw, filename);

                const canonicalAddress = canonizeAddress(address, {
                    bounceable: type !== 'wallet',
                });

                addrbook.set(canonicalAddress, {
                    name, tonIcon,
                    isScam: filename === 'scam.yaml' ? true : isScam,
                });

                // Remove this block after backend update:
                if (type === 'wallet') {
                    addrbook.set(canonizeAddress(address, { bounceable: true }), addrbook.get(canonicalAddress));
                }
            });
    }

    return addrbook;
};

/**
 * @return {Promise<Map>}
 */
const validateYamls = async function checkYamlsWithoutWritingAddressbook() {
    return await createAddressbook();
};

/**
 * @param  {String} directory
 * @return {Promise<Map>}
 */
const saveAddressbook = async function createAndWriteAddressbookJson(directory = BUILD_DIRECTORY) {
    const addresses = await createAddressbook();
    const addressbook = Object.fromEntries(addresses.entries());

    await writeFile(`${directory}addresses.json`, JSON.stringify(addressbook, undefined, 2));
    return addresses;
};

/**
 * @param  {String} addressString
 * @return {Object}
 */
const generateAddressVariants = function generateRawBouncedNonBouncedAddresses(addressString) {
    try {
        const address = new TonWeb.utils.Address(addressString);
        
        // Raw 
        const raw = address.toString(false);
        
        // Bounced (EQ...)
        const bounced = address.toString(true, true, true, false);
        
        // Non-bounced (UQ...)
        const nonBounced = address.toString(true, true, false, false);
        
        return { raw, bounced, nonBounced };
    } catch (error) {
        throw new Error(`Invalid address format: ${addressString} - ${error.message}`);
    }
};

/**
 * @return {Promise<void>}
 */
const copyAvatars = async function copyAvatarsToBuildImgWithoutExtension() {
    try {
        await mkdir(IMG_DIRECTORY, { recursive: true });

        const files = await readdir(AVATARS_DIRECTORY);
        
        // Filter only images
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
        const imageFiles = files.filter(file => {
            const ext = extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        let processedCount = 0;
        
        for (const imageFile of imageFiles) {
            const imagePath = join(AVATARS_DIRECTORY, imageFile);
            const addressString = basename(imageFile, extname(imageFile));
            
            try {
                // Generating raw/bounced/non-bounced forms of address
                const variants = generateAddressVariants(addressString);

                const image = sharp(imagePath);
                
                for (const variant of Object.values(variants)) {
                    const outputFileName = `${variant}.w200.webp`;
                    const outputPath = join(IMG_DIRECTORY, outputFileName);
                    
                    await image
                        .resize(200, 200, {
                            fit: 'cover',
                            position: 'center'
                        })
                        .webp({ quality: 85 })
                        .toFile(outputPath);
                }
                
                processedCount++;
            } catch (error) {
                console.warn(`Failed to process ${imageFile}: ${error.message}`);
            }
        }
        
        console.log(`Successfully processed ${processedCount} images, generated ${processedCount * 3} variants to ${IMG_DIRECTORY}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Avatars directory not found, skipping image copy');
        } else {
            throw error;
        }
    }
};

// Save addressbook if command line has build argument:
if (process.argv.slice(2).includes('build')) {
    const addresses = await saveAddressbook();
    console.log(`Successfully created addressbook with ${addresses.size} addresses`);
    
    // Create images directory and copy avatars to it
    await copyAvatars();

// Just test otherwise:
} else {
    const addresses = await validateYamls();
    console.log(`Success: all yaml files are valid, checked ${addresses.size} addresses`);
}
