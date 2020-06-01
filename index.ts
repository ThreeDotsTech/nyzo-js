import AddressGenerator from './lib/address-generator'
import AddressImporter, { Account, Wallet } from './lib/address-importer'
import NyzoString, { NyzoStringPublicIdentifier, NyzoStringPrivateSeed, NyzoStringPrefilledData } from './lib/nyzoStrings'
const generator = new AddressGenerator()
const importer = new AddressImporter()
const nyzoStrings = new NyzoString()

const wallet = {

	/**
	 * Generate a new Nyzo cryptocurrency wallet
	 *
	 * This function generates a wallet from random entropy. Wallet includes
	 * a BIP39 mnemonic phrase in line with the NYZO Ledger implementation and
	 * a seed, the account is derived using BIP32 deterministic hierarchial algorithm
	 * with input parameters 44'/380' and index 0.
	 *
	 * The NYZO address is encoded from the public key using standard NyzoString.
	 *
	 * Generation uses CryptoJS to generate random entropy by default. You can give your own entropy
	 * as a parameter and it will be used instead.
	 *
	 * An optional seed password can be used to encrypt the mnemonic phrase so the seed
	 * cannot be derived correctly without the password. Recovering the password is not possible.
	 *
	 * @param {string} [entropy] - (Optional) 64 byte hexadecimal string entropy to be used instead of the default
	 * @param {string} [seedPassword] - (Optional) seed password
	 * @returns the generated mnemonic, seed and account
	 */
	generate: (entropy?: string, seedPassword?: string): Wallet => {
		return generator.generateWallet(entropy, seedPassword)
	},

	/**
	 * Import a Nyzo cryptocurrency wallet from a mnemonic phrase
	 *
	 * This function imports a wallet from a mnemonic phrase. Wallet includes the mnemonic phrase,
	 * a seed derived with BIP39 standard and an account derived using BIP32 deterministic hierarchial
	 * algorithm with input parameters 44'/380' and index 0.
	 *
	 * The Nyzo address is derived from the public key using standard NyzoStrings encoding.
	 *
	 * @param {string} mnemonic - The mnemonic phrase. Words are separated with a space
	 * @param {string} [seedPassword] - (Optional) seed password
	 * @throws Throws an error if the mnemonic phrase doesn't pass validations
	 * @returns the wallet derived from the mnemonic (mnemonic, seed, account)
	 */
	fromMnemonic: (mnemonic: string, seedPassword?: string): Wallet => {
		return importer.fromMnemonic(mnemonic, seedPassword)
	},

	/**
	 * Import a Nyzo cryptocurrency wallet from a seed
	 *
	 * This function imports a wallet from a seed. Wallet includes the seed and an account derived using
	 * BIP39 standard and an account derived using BIP32 deterministic hierarchial algorithm with input
	 * parameters 44'/380' and index 0.
	 *
	 * The Nyzo address is derived from the public key using standard NyzoStrings encoding.
	 *
	 * @param {string} seed - The seed
	 * @returns {Wallet} the wallet derived from the seed (seed, account)
	 */
	fromSeed: (seed: string): Wallet => {
		return importer.fromSeed(seed)
	},

	/**
	 * Derive accounts for the seed
	 *
	 * This function derives Nyzo accounts with the BIP32 deterministic hierarchial algorithm
	 * from the given seed with input parameters 44'/380' and indexes based on the from and to
	 * parameters.
	 *
	 * @param {string} seed - The seed
	 * @param {number} from - The start index
	 * @param {number} to - The end index
	 */
	accounts: (seed: string, from: number, to: number): Account[] => {
		return importer.fromSeed(seed, from, to).accounts
	},


}



const tools = {

	/**
	 * Validate mnemonic words
	 *
	 * @param {string} input The address to validate
	 */
	validateMnemonic: (input: string): boolean => {
		return importer.validateMnemonic(input);
	},

	/**
	 * Encode an array of bytes as a Private Key Nyzostring
	 *
	 * @param {Uint8Array} input The array to encode.
	 */
	nyzoStringFromPrivateKey: (input: Uint8Array): string => {
		return nyzoStrings.nyzoStringFromPrivateKey(input);
	},

	/**
	 * Encode an array of bytes as a Public Identifier Nyzostring
	 *
	 * @param {Uint8Array} input The array to encode.
	 */
	nyzoStringFromPublicIdentifier: (input: Uint8Array): string => {
		return nyzoStrings.nyzoStringFromPublicIdentifier(input);
	},

	/**
	 * Encode an array of bytes as a Nyzostring given a prefix
	 *
	 * @param {string} prefix The prefix to use in the encoded string.
	 * @param {Uint8Array} contentBytes The array to encode.
	 */
	encodeNyzoString: (prefix: string, contentBytes: Uint8Array): string => {
		return nyzoStrings.encodeNyzoString(prefix, contentBytes);
	},

	/**
	 * Decodes a string to a NyzoString Object
	 *
	 * @param {string} string The string to decode.
	 */
	decodeNyzoString: (string: string): NyzoStringPublicIdentifier | NyzoStringPrefilledData | NyzoStringPrivateSeed => {
		return nyzoStrings.decodeNyzoString(string);
	},
}

export {
	wallet,
	tools,
}
