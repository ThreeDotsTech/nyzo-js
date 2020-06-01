import Bip32KeyDerivation from './bip32-key-derivation'
import Bip39Mnemonic from './bip39-mnemonic'
import NyzoString from './nyzoStrings'
import Convert from './util/convert'
import { sign } from 'tweetnacl'


export default class AddressImporter {

	/**
	 * Import a wallet using a mnemonic phrase
	 *
	 * @param {string} mnemonic - The mnemonic words to import the wallet from
	 * @param {string} [seedPassword] - (Optional) The password to use to secure the mnemonic
	 * @returns {Wallet} - The wallet derived from the mnemonic phrase
	 */
	fromMnemonic(mnemonic: string, seedPassword = ''): Wallet {
		const bip39 = new Bip39Mnemonic(seedPassword)
		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error('Invalid mnemonic phrase')
		}

		const seed = bip39.mnemonicToSeed(mnemonic)
		return this.nyzo(seed, 0, 0, mnemonic)
	}

	/**
	 * Validate mnemonic words
	 *
	 * @param mnemonic {string} mnemonic - The mnemonic words to validate
	 */
	validateMnemonic(mnemonic: string): boolean {
		const bip39 = new Bip39Mnemonic()
		return bip39.validateMnemonic(mnemonic);
	}

	/**
	 * Import a wallet using a seed
	 *
	 * @param {string} seed - The seed to import the wallet from
	 * @param {number} [from] - (Optional) The start index of the private keys to derive from
	 * @param {number} [to] - (Optional) The end index of the private keys to derive to
	 * @returns {Wallet} The wallet derived from the mnemonic phrase
	 */
	fromSeed(seed: string, from = 0, to = 0): Wallet {
		if (seed.length !== 128) {
			throw new Error('Invalid seed length, must be a 128 byte hexadecimal string')
		}
		if (!/^[0-9a-f]+$/i.test(seed)) {
			throw new Error('Seed is not a valid hexadecimal string')
		}

		return this.nyzo(seed, from, to, undefined)
	}


	/**
	 * Derives the private keys
	 *
	 * @param {string} seed - The seed to use for private key derivation
	 * @param {number} from - The start index of private keys to derive from
	 * @param {number} to - The end index of private keys to derive to
	 * @param {string} [mnemonic] - (Optional) the mnemonic phrase to return with the wallet
	 */
	private nyzo(seed: string, from: number, to: number, mnemonic?: string): Wallet {
		const accounts = []

		for (let i = from; i <= to; i++) {
			const bip44 = new Bip32KeyDerivation(`44'/380'/${i}'`, seed)
			const privateKey = bip44.derivePath().key

			const keyPair = sign.keyPair.fromSeed(Convert.hex2ab(privateKey))

			const nyzoString = new NyzoString()
			const nyzoStringId = nyzoString.nyzoStringFromPublicIdentifier(keyPair.publicKey)
			const nyzoStringKey = nyzoString.nyzoStringFromPrivateKey(Convert.hex2ab(privateKey))

			accounts.push({
				accountIndex: i,
				privateKey: privateKey,
				publicKey: Convert.ab2hex(keyPair.publicKey),
				publicKeyAsNyzoString: nyzoStringId,
				privateKeyAsNyzoString: nyzoStringKey,
			})
		}

		return {
			mnemonic,
			seed,
			accounts,
		}
	}

}

export class Wallet {
	mnemonic: string
	seed: string
	accounts: Account[]
}



export interface Account {
	accountIndex: number
	privateKey: string
	publicKey: string
	publicKeyAsNyzoString: string
	privateKeyAsNyzoString: string
}
