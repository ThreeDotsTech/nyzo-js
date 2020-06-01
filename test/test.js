'use strict'

const expect = require('chai').expect
const { wallet, tools } = require('../dist/index')

// WARNING: Do not send any funds to the test vectors below
describe('generate wallet test', () => {

	it('should generate wallet with random entropy', () => {
		const result = wallet.generate()
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
	})

	it('should generate the correct wallet with the given test vector', () => {
		const result = wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c7970')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.equal('hole kiss mouse jacket also board click series citizen slight kite smoke desk diary rent mercy inflict antique edge invite slush athlete total brain')
		expect(result.seed).to.equal('1accdd4c25e06e47310d0c62c290ec166071d024352e003e5366e8ba6ba523f2a0cb34116ac55a238a886778880a9b2a547112fd7cffade81d8d8d084ccb7d36')
		expect(result.accounts[0].publicKeyAsNyzoString).to.equal('id__86oaT2D2Pa~g7Ymze4egW4EBXFvT05CeMGV.7wV5xgVnqPGwR~g~')
		expect(result.accounts[0].privateKeyAsNyzoString).to.equal('key_84m9zRz60sI4upVem0BBipCLNM~xgsD_YnWN59L.vL6E4xQKTySS')
	})

	it('should generate the correct wallet with the given test vector and a seed password', () => {
		// Using the same entropy as before, but a different password
		const result = wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c7970', 'some password')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')

		// Should result in the same mnemonic, but different seed and account
		expect(result.mnemonic).to.equal('hole kiss mouse jacket also board click series citizen slight kite smoke desk diary rent mercy inflict antique edge invite slush athlete total brain')
		expect(result.seed).to.not.equal('1accdd4c25e06e47310d0c62c290ec166071d024352e003e5366e8ba6ba523f2a0cb34116ac55a238a886778880a9b2a547112fd7cffade81d8d8d084ccb7d36')
		expect(result.accounts[0].publicKeyAsNyzoString).to.not.equal('id__86oaT2D2Pa~g7Ymze4egW4EBXFvT05CeMGV.7wV5xgVnqPGwR~g~')
		expect(result.accounts[0].privateKeyAsNyzoString).to.not.equal('key_84m9zRz60sI4upVem0BBipCLNM~xgsD_YnWN59L.vL6E4xQKTySS')

		expect(result.seed).to.equal('146e3e2a0530848c9174d45ecec8c3f74a7be3f1ee832f92eb6227284121eb2e48a6b8fc469403984cd5e8f0d1ed05777c78f458d0e98c911841590e5d645dc3')
		expect(result.accounts[0].publicKeyAsNyzoString).to.equal('id__808iEi5-8Eu0iaJ~8_RHpeKz6f556gPfxwmmK7cBIZLWPwPDjhDF')
		expect(result.accounts[0].privateKeyAsNyzoString).to.equal('key_86c-GZT-o4o4Axm20xgKYkcjYVqrYI-VsCb4ap_2-q4BZR5vjwCP')
	})

	it('should throw when given an entropy with an invalid length', () => {
		expect(() => wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c797')).to.throw(Error)
		expect(() => wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c79701')).to.throw(Error)
	})

	it('should throw when given an entropy containing non-hex characters', () => {
		expect(() => wallet.generate('6gaf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c7970')).to.throw(Error)
	})

})

describe('import wallet with test vectors test', () => {

	it('should successfully import a wallet with the test vectors mnemonic', () => {
		const result = wallet.fromMnemonic(
			'edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur',
			'some password')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.equal('edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur')
		expect(result.seed).to.equal('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result.accounts[0].publicKeyAsNyzoString).to.equal('id__86D.wnNXXInb.Kpyrre34PTj1tFCk8aMhycFvzfdkxztut7MwNG_')
		expect(result.accounts[0].privateKeyAsNyzoString).to.equal('key_8fUPS3GxxYqyL.sx4zC1_CfnQFCoYjnBMNKdETuqgv~prurNnmH4')
	})

	it('should successfully import a wallet with the checksum starting with a zero', () => {
		wallet.fromMnemonic('food define cancel major spoon trash cigar basic aim bless wolf win ability seek paddle bench seed century group they mercy address monkey cake')
	})

	it('should successfully import a wallet with the test vectors seed', () => {
		const result = wallet.fromSeed('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.be.undefined
		expect(result.seed).to.equal('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result.accounts[0].publicKeyAsNyzoString).to.equal('id__86D.wnNXXInb.Kpyrre34PTj1tFCk8aMhycFvzfdkxztut7MwNG_')
		expect(result.accounts[0].privateKeyAsNyzoString).to.equal('key_8fUPS3GxxYqyL.sx4zC1_CfnQFCoYjnBMNKdETuqgv~prurNnmH4')
	})

	it('should throw when given a seed with an invalid length', () => {
		expect(() => wallet.generate('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310')).to.throw(Error)
		expect(() => wallet.generate('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310cd')).to.throw(Error)
	})

	it('should throw when given a seed containing non-hex characters', () => {
		expect(() => wallet.generate('0gc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')).to.throw(Error)
	})

})

describe('derive more accounts from the same seed test', () => {

	it('should derive accounts from the given seed', () => {
		const result = wallet.accounts(
			'0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c',
			0, 14)
		expect(result.length).to.equal(15)
		expect(result[0].publicKeyAsNyzoString).to.equal('id__86D.wnNXXInb.Kpyrre34PTj1tFCk8aMhycFvzfdkxztut7MwNG_')
		expect(result[0].privateKeyAsNyzoString).to.equal('key_8fUPS3GxxYqyL.sx4zC1_CfnQFCoYjnBMNKdETuqgv~prurNnmH4')
		expect(result[14].publicKeyAsNyzoString).to.equal('id__84QoW-E4fm1Pw8E4PPD.G9UCJvZDzccF0-jBo~VDwnrz8S0spIMz')
		expect(result[14].privateKeyAsNyzoString).to.equal('key_81xsrNFc-~IB9pAvsgHF4fBRkixFVqCv7FvD2uZ5Bgre3Lt8VVfn')
	})

})
