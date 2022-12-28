import { ethers } from 'ethers'
import lendPoolAbi from './abi'
import { CHAINS_CONFIGURATION } from '~/lib/constants'
import { IBendDaoQuote } from '~/types'

const lendPool = '0x70b97A0da65C15dfb0FFA02aEE6FA36e507C2762'
const nfts = [
	'0xb7f7f6c52f2e2fdb1963eab30438024864c313f6',
	'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
	'0x60e4d786628fea6478f785a6d7e704777c86a7c6',
	'0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
	'0xed5af388653567af2f388e6224dc7c4b3241c544',
	'0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
	'0x620b70123fb810f6c653da7644b5dd0b6312e4d8',
	'0x23581767a106ae21c074b2276d25e5c3e136a68b'
]
const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

export async function getDataBendDao(nft: string) {
	if (!nfts.includes(nft.toLowerCase())) return []
	const lendPoolContract = new ethers.Contract(lendPool, lendPoolAbi, CHAINS_CONFIGURATION[1].chainProvider)
	const collateralData = await lendPoolContract.getNftCollateralData(nft, weth)
	const result: IBendDaoQuote[] = [
		{
			floorInEth: collateralData.totalCollateralInReserve.toString(),
			borrowableToken: weth,
			availableBorrow: collateralData.availableBorrows.toString(),
			ltv: collateralData.ltv.toString(),
			liquidationThreshold: collateralData.liquidationThreshold.toString(),
			loanUrl: 'https://www.benddao.xyz/en/account/my-nfts/?action=batch-borrow'
		}
	]

	return result
}
