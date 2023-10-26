# 🗒️ TON address book

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


## Building
```bash
npm install && npm run build
```

## See also
- [tonkeeper/ton-assets](https://github.com/tonkeeper/ton-assets) – address book used in Tonkeeper wallet
- [menschee/tonscanplus](https://github.com/menschee/tonscanplus) – alternative address book

