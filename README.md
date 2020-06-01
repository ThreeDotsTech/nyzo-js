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
  mnemonic: 'hole kiss mouse jacket also board click series citizen slight kite smoke desk diary rent mercy inflict antique edge invite slush athlete total brain',
  seed: '1accdd4c25e06e47310d0c62c290ec166071d024352e003e5366e8ba6ba523f2a0cb34116ac55a238a886778880a9b2a547112fd7cffade81d8d8d084ccb7d36',
  accounts: [
    {
      accountIndex: 0,
      privateKey: '45498b388601bac4758dce54092449896ec2ffa041b9bfe96e30149bbd7ae1a7',
      publicKey: '65cad42982c4af901fa562384390e049e4e687b500594ebe9dfd1dfdc5810dd6',
      publicKeyAsNyzoString: 'id__86oaT2D2Pa~g7Ymze4egW4EBXFvT05CeMGV.7wV5xgVnqPGwR~g~',
      privateKeyAsNyzoString: 'key_84m9zRz60sI4upVem0BBipCLNM~xgsD_YnWN59L.vL6E4xQKTySS'
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
