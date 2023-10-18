import { readdir, readFile, writeFile } from 'node:fs/promises';
import { parseAllDocuments } from 'yaml'
import TonWeb from 'tonweb';

const CONTRACT_TYPES = [
    'wallet',
    'nft_collection',
    'jetton',
    'pool',
];

const YAML_DIRECTORY = './source/';
const BUILD_DIRECTORY = './build/';

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
            .map(({ address, name, tonIcon, isScam, type }) => ({
                address: canonizeAddress(address, { bounceable: type !== 'wallet' }),
                isScam: filename === 'scam.yaml' ? true : isScam,
                name,
                tonIcon,
            }))
            .forEach(({ address, ...entry }) => {
                const raw = canonizeAddressToRaw(address);

                if (addresses.has(raw)) {
                    throw new Error(`[${filename}] Address ${address} is already defined in ${addresses.get(raw)}`);
                }

                addrbook.set(address, entry);
                addresses.set(raw, filename);
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

// Save addressbook if command line has build argument:
if (process.argv.slice(2).includes('build')) {
    const addresses = await saveAddressbook();
    console.log(`Successfully created addressbook with ${addresses.size} addresses`);

// Just test otherwise:
} else {
    const addresses = await validateYamls();
    console.log(`Success: all yaml files are valid, checked ${addresses.size} addresses`);
}
