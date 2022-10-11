import BigNumber from 'bignumber.js'
import { SECONDS_IN_A_DAY, SECONDS_IN_A_YEAR } from '~/lib/constants'

// returns item quote price in 'ether'
export function getQuotePrice({ oraclePrice, ltv }: { oraclePrice: number; ltv: number }) {
	return new BigNumber(oraclePrice).times(ltv).div(1e18).div(1e18).toFixed(4)
}

// returns currentAnnualInterest
export function formatCurrentAnnualInterest(currentAnnualInterest: number) {
	return (currentAnnualInterest / 1e16).toFixed(2)
}

// returns currentAnnualInterest arg that is passed in a contracts method
export function getTotalReceivedArg({
	oraclePrice,
	noOfItems,
	ltv
}: {
	oraclePrice: number
	noOfItems: number
	ltv: number
}) {
	return new BigNumber(oraclePrice).times(noOfItems).times(ltv).div(1e18).toFixed(0)
}

interface IFormArgs {
	nftAddress: string
	name: string
	symbol: string
	maxPrice: number
	maxDailyBorrows: number
	maxLengthInDays: number
	maxVariableInterestPerEthPerSecond: number
	minimumInterest: number
	ltv: number
}

// returns formatted args that are passed to createPool() method
export function formatCreatePoolFormInputs({
	nftAddress,
	name,
	symbol,
	maxPrice,
	maxDailyBorrows,
	maxLengthInDays,
	maxVariableInterestPerEthPerSecond,
	minimumInterest,
	ltv
}: IFormArgs) {
	const maxInt = Number(
		new BigNumber(maxVariableInterestPerEthPerSecond / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0)
	)

	const minInt = Number(new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0))

	return {
		maxPrice: new BigNumber(maxPrice).times(1e18).toFixed(0),
		nftAddress,
		maxDailyBorrows: new BigNumber(maxDailyBorrows).times(1e18).toFixed(0),
		name,
		symbol,
		maxLength: (maxLengthInDays * SECONDS_IN_A_DAY).toFixed(0),
		maxVariableInterestPerEthPerSecond: (maxInt - minInt).toFixed(0),
		minimumInterest: new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0),
		ltv: new BigNumber(ltv).times(1e16).toFixed(0)
	}
}

// returns maximum no.of nfts a user can borrow based on pool balance
export function getMaxNftsToBorrow({
	maxInstantBorrow,
	oraclePrice,
	ltv
}: {
	maxInstantBorrow: number
	oraclePrice: number
	ltv: number
}) {
	return (maxInstantBorrow / (oraclePrice * (ltv / 1e18))).toFixed(0)
}
