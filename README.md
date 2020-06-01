# nyzo-js

[![GitHub license](https://img.shields.io/github/license/ThreeDotsTech/nyzo-js)](https://github.com/ThreeDotsTech/nyzo-js/blob/master/LICENSE)

Toolkit for Nyzo cryptocurrency allowing to create and manage acounts implementing BIP32, BIP39 and BIP 44.

The toolkit supports creating and importing wallets and encoding and decoding NyzoStrings

## Features

* Generate wallets with a BIP32 mnemonic phrase
* BIP39/44 private key derivation
* Import wallets with a mnemonic phrase or a seed
* Runs in all web browsers and mobile frameworks built with Javascript
* Validate addresses and mnemonic words
* Encode and decode Nyzostrings

---

## Usage

### From NPM

```console
npm install nyzo-js
```

| WARNING: do not use any of the keys or addresses listed below to send real assets! |
| --- |

#### Wallet handling

```javascript
import { wallet } from 'nyzo-js'

// Generates a new wallet with a mnemonic phrase, seed and an account
// You can also generate your own entropy for the mnemonic or set a seed password
// Notice, that losing the password will make the mnemonic phrase void
const wallet = wallet.generate(entropy?, password?)

// Import a wallet with the mnemonic phrase
const wallet = wallet.fromMnemonic(mnemonic, seedPassword?)

// Import a wallet with a seed
const wallet = wallet.fromSeed(seed)


// Derive private keys for a seed, from and to are number indexes
const accounts = wallet.accounts(seed, from, to)

```

```javascript
// The returned wallet JSON format is as follows. The mnemonic phrase will be undefined when importing with a seed.
{
    mnemonic: 'edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur',
    seed: '0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c',
    accounts: [
        {
            accountIndex: 0,
            privateKey: '3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143',
            publicKey: '5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4',
            address: 'nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d'
        }
    ]
}
```

#### Validating values

```javascript
import { tools } from 'nyzo-js'


// Validate mnemonic words
const valid = tools.validateMnemonic('edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur')
```

---

## Contributions

You are welcome to contribute to the module. To develop, use the following commands.

* `npm install` to install all the dependencies
* `npm run build` to build the Typescript code
* `npm run test` to run the tests

## Donations

If you find this piece of software helpful, consider buying us a cup of coffe.

  `NYZO: id__80qi1DrCJZfcPPVeC83CgCX36SDN.StRhKYSeB-rrqr7z-_LShR7` 
  
  `BTC: bc1qsshn75ase5c66sjlfmefymw5dx8w384jvp4v0j` 
###### Made with ♥ for the community
