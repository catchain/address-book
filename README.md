# 🗒️ TON Address Book

This is an address book for [tonscan.org](https://tonscan.org) explorer. It is build automatically from `.yaml` files and published at [this url](https://address-book.tonscan.org/addresses.json). 

Address book is used to substitute some popular and important TON addresses with human readable names. It is **not** used in tonscan.org search. If you'd like to add your address into the search, please open an issue.

## Contributing
Just add your address to the appropriate **.yaml** file in the [`source`](https://github.com/catchain/address-book/blob/master/source) directory.

How to choose category:

- [**community.yaml**](https://github.com/catchain/address-book/blob/master/source/community.yaml) is for notable community projects: NFTs, marketplaces, bots, etc.
- [**exchanges.yaml**](https://github.com/catchain/address-book/blob/master/source/exchanges.yaml) is for exchanges and DEXes.
- [**system.yaml**](https://github.com/catchain/address-book/blob/master/source/system.yaml) is for core blockchain contracts like root DNS, pow-givers, elector etc.
- [**validators.yaml**](https://github.com/catchain/address-book/blob/master/source/validators.yaml) is for validators and pools.
- [**people.yaml**](https://github.com/catchain/address-book/blob/master/source/people.yaml) is for celebreties and famous people.
- [**scam.yaml**](https://github.com/catchain/address-book/blob/master/source/scam.yaml) – all addresses in this file will be marked with red SCAM badge.

Entry structure must be as follows:

```yaml
- address: TON address in any format
  name: Short name for your project, 3-32 symbols
  description: |-
    You may provide short description for your project.
    Any amount of text and links are allowed.
  type: wallet (or empty: see below)
```

#### Contract type
`type` field can either be empty (just don't use it in entry) or one of these values: `wallet`, `nft_collection`, `jetton`, `pool`.

**⚠️ Important:** use `wallet` type for **all wallets** (including validator addresses) and **uninit** addresses.

This field is needed because some addresses in TON have to be in other format (UQ vs EQ). The address itself can be in any format, just set the correct `type`.

## Adding images
Use the `avatars` directory to add images to addresses. The image name must be a TON address in any format. Acceptable image extensions: `jpg`, `jpeg`, `png`, `webp`

After the build, the images will be available in the `/build/img` folder in three address formats (raw/bounced/non-bounced).


## Building
```bash
npm install && npm run build
```

## Important addresses
Frequently used addresses: core contracts, Telegram, Fragment and major ecosystem wallets. Full list is in [`source`](https://github.com/catchain/address-book/blob/master/source).

| Name | Address |
|------|---------|
| [CAT Services](https://tonscan.org/address/UQDCH6vT0MvVp0bBYNjoONpkgb51NMPNOJXFQWG54XoIApOd) | `UQDCH6vT0MvVp0bBYNjoONpkgb51NMPNOJXFQWG54XoIApOd` |
| [System](https://tonscan.org/address/Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU) | `Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU` |
| [Elector](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF) | `Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF` |
| [Config](https://tonscan.org/address/Ef9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVbxn) | `Ef9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVbxn` |
| [Burn Address](https://tonscan.org/address/UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ) | `UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ` |
| [Blackhole](https://tonscan.org/address/Uf___________________________________________-ll) | `Uf___________________________________________-ll` |
| [Telegram](https://tonscan.org/address/UQCMOXxD-f8LSWWbXQowKxqTr3zMY-X1wMTyWp3B-LR6syif) | `UQCMOXxD-f8LSWWbXQowKxqTr3zMY-X1wMTyWp3B-LR6syif` |
| [Fragment](https://tonscan.org/address/EQBAjaOyi2wGWlk-EDkSabqqnF-MrrwMadnwqrurKpkla9nE) | `EQBAjaOyi2wGWlk-EDkSabqqnF-MrrwMadnwqrurKpkla9nE` |
| [The Locker](https://tonscan.org/address/EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2) | `EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2` |
| [Ecosystem Reserve](https://tonscan.org/address/UQBmzW4wYlFW0tiBgj5sP1CgSlLdYs-VpjPWM7oPYPYWQBqW) | `UQBmzW4wYlFW0tiBgj5sP1CgSlLdYs-VpjPWM7oPYPYWQBqW` |
| [Tether Treasury](https://tonscan.org/address/EQAj-peZGPH-cC25EAv4Q-h8cBXszTmkch6ba6wXC8BM4xdo) | `EQAj-peZGPH-cC25EAv4Q-h8cBXszTmkch6ba6wXC8BM4xdo` |
