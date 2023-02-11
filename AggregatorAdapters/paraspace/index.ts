import { BigNumber, ethers } from 'ethers/lib'
import { CHAINS_CONFIGURATION } from '~/lib/constants'
import { IParaSpaceQuote } from '~/types'
import { UiPooDataProviderABI } from './abi'

const UiPoolDataProvider = '0xe8fcBd03a29912b63EE154AB4601e1D64b31586c'
const PoolAddressProvider = '0x6cD30e716ADbE47dADf7319f6F2FB83d507c857d'

const uiPool = new ethers.Contract(UiPoolDataProvider, UiPooDataProviderABI, CHAINS_CONFIGURATION[1].chainProvider)

export const getParaSpaceCollections = async () => {
	const [reservesData] = await uiPool.getReservesData(PoolAddressProvider)
	return reservesData
		.filter((r: any) => r.assetType.toString() === '1' && r.usageAsCollateralEnabled)
		.map((r: any) => r.underlyingAsset.toLowerCase())
}

export async function getDataParaspace(nft: string) {
	try {
		const [reservesData] = await uiPool.getReservesData(PoolAddressProvider)
		const nftData = reservesData.find((r: any) => r.underlyingAsset.toLowerCase() === nft.toLowerCase())
		if (!nftData) return []
		const erc20Data = reservesData.filter((r: any) => r.assetType.toString() === '0' && r.borrowingEnabled)
		const nftAvailableBorrowInETH = BigNumber.from(nftData.priceInMarketReferenceCurrency)
			.mul(nftData.baseLTVasCollateral)
			.div(10000)

		const result: IParaSpaceQuote[] = erc20Data.map((r: any) => {
			return {
				floorInEth: nftData.priceInMarketReferenceCurrency.toString(),
				borrowableToken: r.underlyingAsset,
				borrowableTokenVariableBorrowRate: r.variableBorrowRate.toString(),
				availableBorrow: nftAvailableBorrowInETH
					.mul(BigNumber.from(10).pow(r.decimals))
					.div(r.priceInMarketReferenceCurrency)
					.toString(),
				ltv: nftData.baseLTVasCollateral.toString(),
				liquidationThreshold: nftData.reserveLiquidationThreshold.toString(),
				loanUrl: 'https://app.para.space/'
			}
		})

		return result
	} catch (error) {
		console.error(`Failed to get ParaSpace data: ${error}`)
		return []
	}
}
