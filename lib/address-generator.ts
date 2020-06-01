import Bip32KeyDerivation from './bip32-key-derivation'
import Bip39Mnemonic from './bip39-mnemonic'
import { sign } from "tweetnacl";
import { Wallet } from './address-importer'
import NyzoString from './nyzoStrings'
import Convert from './util/convert'

export default class AddressGenerator {
	/**
	 * Generates the wallet
	 *
	 * @param {string} [entropy] - (Optional) Custom entropy if the caller doesn't want a default generated entropy
	 * @param {string} [seedPassword] - (Optional) Password for the seed
	 */
	generateWallet(entropy = '', seedPassword: string = ''): Wallet {
		const bip39 = new Bip39Mnemonic(seedPassword)
		const wallet = bip39.createWallet(entropy)

		const bip44 = new Bip32KeyDerivation(`44'/380'/0'`, wallet.seed)
		const privateKey = bip44.derivePath().key

		const keyPair = sign.keyPair.fromSeed(Convert.hex2ab(privateKey))

		const nyzoString = new NyzoString()
		const nyzoStringId = nyzoString.nyzoStringFromPublicIdentifier(keyPair.publicKey)
		const nyzoStringKey = nyzoString.nyzoStringFromPrivateKey(Convert.hex2ab(privateKey))

		return {
			mnemonic: wallet.mnemonic,
			seed: wallet.seed,
			accounts: [{
				accountIndex: 0,
				privateKey: privateKey,
				publicKey: Convert.ab2hex(keyPair.publicKey),
				publicKeyAsNyzoString: nyzoStringId,
				privateKeyAsNyzoString: nyzoStringKey
			}],
		}
	}

}
