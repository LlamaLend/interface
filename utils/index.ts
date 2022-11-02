import BigNumber from 'bignumber.js'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import { SECONDS_IN_A_DAY, SECONDS_IN_A_YEAR } from '~/lib/constants'

// @ts-ignore
dayjs.extend(relativeTime)

// returns item quote price in 'ether'
export function getQuotePrice({ oraclePrice, ltv }: { oraclePrice: string; ltv: string }) {
	return new BigNumber(oraclePrice).times(ltv).div(1e18).div(1e18).toFixed(4)
}

// returns currentAnnualInterest
export function formatCurrentAnnualInterest(currentAnnualInterest: string) {
	return new BigNumber(currentAnnualInterest.toString()).div(1e16).toFixed(2)
}

// returns totalToBorrow arg that is passed in a contracts method
export function getTotalReceivedArg({
	oraclePrice,
	noOfItems,
	ltv
}: {
	oraclePrice: string
	noOfItems: number
	ltv: string
}) {
	if (!oraclePrice || !ltv || !noOfItems) {
		return '0'
	}

	return new BigNumber(new BigNumber(oraclePrice).times(ltv).div(1e18).toFixed(0, 1)).times(noOfItems).toFixed(0, 1)
}

interface IFormArgs {
	nftAddress: string
	name: string
	symbol: string
	maxPrice: number
	maxDailyBorrows: number
	maxLengthInDays: number
	maximumInterest: number
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
	maximumInterest,
	minimumInterest,
	ltv
}: IFormArgs) {
	const maxInt = Number(new BigNumber(maximumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1))

	const minInt = Number(new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1))

	return {
		maxPrice: new BigNumber(maxPrice).times(1e18).toFixed(0, 1),
		nftAddress,
		maxDailyBorrows: new BigNumber(maxDailyBorrows).times(1e18).toFixed(0, 1),
		name,
		symbol,
		maxLength: (maxLengthInDays * SECONDS_IN_A_DAY).toFixed(0),
		maxVariableInterestPerEthPerSecond: (maxInt - minInt).toFixed(0),
		minimumInterest: new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1),
		ltv: new BigNumber(ltv).times(1e16).toFixed(0, 1)
	}
}

export const formatLtv = (ltv: string) => new BigNumber(ltv).times(1e16).toFixed(0, 1)
export const formatMaxPrice = (maxPrice: string) => new BigNumber(maxPrice).times(1e18).toFixed(0, 1)
export const formatAmountToDepositOrWithdraw = (maxPrice: string) => new BigNumber(maxPrice).times(1e18).toFixed(0, 1)
export const formatMaxDailyBorrows = (maxDailyBorrows: string) =>
	new BigNumber(maxDailyBorrows).times(1e18).toFixed(0, 1)
export const formatMaxLoanLength = (maxLengthInDays: string) => (Number(maxLengthInDays) * SECONDS_IN_A_DAY).toFixed(0)
export const formateInterestChange = (
	minimumInterest: number,
	maximumInterest: number,
	isInvalidInterests: boolean
) => {
	if (isInvalidInterests) {
		return [0, 0]
	}

	const maxInt = Number(new BigNumber(maximumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1))

	const minInt = Number(new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1))

	return [
		(maxInt - minInt).toFixed(0),
		new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0, 1)
	]
}

// returns 66% of an nft's oracle price that is populated in create pool form's maxPricePerNft input field
export function getMaxPricePerNft({ oraclePrice, ltv }: { oraclePrice?: string | null; ltv?: number | null }) {
	if (!oraclePrice || !ltv) {
		return ''
	}

	const formattedOraclePrice = new BigNumber(oraclePrice).div(1e18).toString()

	const ltvRatio = ltv / 100

	return new BigNumber(formattedOraclePrice)
		.multipliedBy(1 / ltvRatio + 1)
		.div(2)
		.toFixed(4)
}

// returns maximum no.of nfts a user can borrow based on pool balance
export function getMaxNftsToBorrow({
	maxInstantBorrow,
	oraclePrice,
	ltv
}: {
	maxInstantBorrow: string
	oraclePrice: string
	ltv: string
}) {
	if (maxInstantBorrow === '0' || oraclePrice === '0' || ltv === '0') {
		return '0'
	}

	const formattedLtv = new BigNumber(ltv).div(1e18)

	const price = new BigNumber(oraclePrice).times(formattedLtv)

	return new BigNumber(maxInstantBorrow.toString()).div(price).toFixed(0, 1)
}

export function formatLoanDeadline(deadline: number) {
	const isExpired = deadline - Date.now() <= 0 ? true : false

	// @ts-ignore
	return isExpired ? 'Expired' : dayjs(deadline).toNow(true) + ' left'
}

export function getLoansPayableAmount(totalToRepay: number) {
	// add 5% buffer to totalToRepay
	const buffer = new BigNumber(totalToRepay).times(0.05).toFixed(0, 1)

	return new BigNumber(totalToRepay).plus(buffer).toFixed(0, 1)
}

export const gasLimitOverride = new BigNumber(0.0005).times(1e9).toFixed(0, 1)
