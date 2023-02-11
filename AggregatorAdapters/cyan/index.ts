import { ICyanQuote } from '~/types'

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.CYAN_API_KEY as string)

export async function getDataCyan(collectionAddress: string) {
	try {
		const res = await fetch(`https://api.usecyan.com/pawn/estimated/${collectionAddress}`, {
			headers: requestHeaders
		}).then((res) => res.json())

		const result: ICyanQuote[] = []
		res.forEach((item: any) => {
			result.push({
				currency: item.currency,
				amount: item.unlockAmount,
				interestRate: item.interestRate,
				interestRateApr: item.interestRateApr,
				totalNumOfPayments: item.totalNumOfPayments,
				term: item.term,
				url: `https://dapp.usecyan.com/#/bnpl/${collectionAddress}`
			})
		})

		return result
	} catch (error) {
		console.error(`Failed to get Cyan data: ${error}`)
		return []
	}
}

export async function getCyanCollections() {
	try {
		const res = await fetch('https://api.usecyan.com/collections?chainId=1', {
			headers: requestHeaders
		}).then((res) => res.json())
		return res.map((col: any) => col.address)
	} catch (error) {
		console.error(`Failed to get Cyan collections: ${error}`)
		return []
	}
}
