import { ethers } from 'ethers'
import nftVault from './nftVaultAbi'
import { CHAINS_CONFIGURATION } from '~/lib/constants'
import { IJpegdQuote } from '~/types'
import nftValueProvider from './nftValueProviderAbi'

const nftToValueProvider: { [key: string]: string } = {
	// Cryptopunks
	'0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': '0xDF7806Eaa13497effFdB1541d6b0FdD1A9566fd0',
	// Etherrocks
	'0x41f28833be34e6ede3c58d1f597bef429861c4e2': '0x9921da2908CC59b13ddbcF45e64BFA91c78c4249',
	// BAYC
	'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': '0x5b9cAA47A52e4BfbBce2f2A9f858c2A501B48C42',
	// MAYC
	'0x60e4d786628fea6478f785a6d7e704777c86a7c6': '0xdEd112453BD8EA88CdaB214CFD92Ab06E232E9d7',
	// Doodles
	'0x8a90cab2b38dba80c64b7734e58ee1db38b8992e': '0xdd245B7823ee82D14419CE072Ef815868F0D1f1A',
	// AZUKI
	'0xed5af388653567af2f388e6224dc7c4b3241c544': '0xcaA0aa80637262fd3Ba6DD5b5598a2BAFAc27cE8',
	// Pudgy Penguins
	'0xbd3531da5cf5857e7cfaa92426877b022e612cf8': '0xd0bf9A40FebDfCA596fde589a343C6cDA37A7B90',
	// CloneX
	'0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': '0xb36B65400E13FF57dFDa29bBb7dC79eaA7ecA14C'
}

const nftToPusd: { [key: string]: string } = {
	// Cryptopunks
	'0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': '0xD636a2fC1C18A54dB4442c3249D5e620cf8fE98F',
	// Etherrocks
	'0x41f28833be34e6ede3c58d1f597bef429861c4e2': '0x6837A113AA7393FfBD5F7464e7313593cd2dD560',
	// BAYC
	'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': '0x271c7603AAf2BD8F68e8Ca60f4A4F22c4920259f',
	// MAYC
	'0x60e4d786628fea6478f785a6d7e704777c86a7c6': '0x7B179f9bFBE50cFA401C1Cdde3cB2C339c6635F3',
	// Doodles
	'0x8a90cab2b38dba80c64b7734e58ee1db38b8992e': '0x0A36F4bF39Ed7D4718BD1b8dD759C19986CCd1a7',
	// AZUKI
	'0xed5af388653567af2f388e6224dc7c4b3241c544': '0x2acd96c8dB23978A3Dd32448A2477B132b4436E4',
	// Pudgy Penguins
	'0xbd3531da5cf5857e7cfaa92426877b022e612cf8': '0xE793eAeDC048b7441Ed61b51aCB5df107aF996c2',
	// CloneX
	'0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': '0xC001F165F7D7542d22A1e82B4640512034A91c7d'
}

const nftToPeth: { [key: string]: string } = {
	// Cryptopunks
	'0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': '0x4e5F305bFCa77b17f804635A9bA669e187d51719',
	// Etherrocks
	'0x41f28833be34e6ede3c58d1f597bef429861c4e2': '0x7Bc8c4D106f084304d6c224F48AC02e6854C7AC5',
	// BAYC
	'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': '0xAF5E4c1bFaC63e355cF093eea3d4AbA138eA4089',
	// MAYC
	'0x60e4d786628fea6478f785a6d7e704777c86a7c6': '0xc45775baA4a6040414f3e199767033257A2A91b9',
	// Doodles
	'0x8a90cab2b38dba80c64b7734e58ee1db38b8992e': '0x229e09d943a94c162A662BA0ffBCaD21521B477A',
	// AZUKI
	'0xed5af388653567af2f388e6224dc7c4b3241c544': '0x72695c2aF4193029E0669F2C01d84B619d8C25e7',
	// Pudgy Penguins
	'0xbd3531da5cf5857e7cfaa92426877b022e612cf8': '0x4b94B38beC611A2c93188949F017806c22097e9f',
	// CloneX
	'0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': '0x46db8fda0bE00E8912Bc28357d1E28E39bb404e2'
}

const zeroAddress = '0x0000000000000000000000000000000000000000'
const peth = '0x836A808d4828586A69364065A1e064609F5078c7'
const pusd = '0x466a756E9A7401B5e2444a3fCB3c2C12FBEa0a54'

export async function getDataJpegd(nft: string) {
	try {
		nft = nft.toLowerCase()
		if (!nftToPeth[nft] || !nftToPusd[nft] || !nftToValueProvider[nft]) return []
		const provider = CHAINS_CONFIGURATION[1].chainProvider
		const valueProvider = new ethers.Contract(nftToValueProvider[nft], nftValueProvider, provider)
		const pethVault = new ethers.Contract(nftToPeth[nft], nftVault, provider)
		const pusdVault = new ethers.Contract(nftToPusd[nft], nftVault, provider)
		const [floor, pethCredit, pusdCredit, pethLiquidation, pusdLiquidation] = await Promise.all([
			valueProvider.getFloorETH(),
			pethVault.getCreditLimit(zeroAddress, '0'),
			pusdVault.getCreditLimit(zeroAddress, '0'),
			pethVault.getLiquidationLimit(zeroAddress, '0'),
			pusdVault.getLiquidationLimit(zeroAddress, '0')
		])
		const results: IJpegdQuote[] = [
			{
				vaultName: 'pETH Vault',
				floorInEth: floor.toString(),
				pToken: peth,
				credit: pethCredit.toString(),
				liquidationLimit: pethLiquidation.toString(),
				loanUrl: 'https://jpegd.io/vaults'
			},
			{
				vaultName: 'pUSD Vault',
				floorInEth: floor.toString(),
				pToken: pusd,
				credit: pusdCredit.toString(),
				liquidationLimit: pusdLiquidation.toString(),
				loanUrl: 'https://jpegd.io/vaults'
			}
		]
		return results
	} catch (error) {
		console.error(`Failed to get JPEG'd data: ${error}`)
		return []
	}
}
