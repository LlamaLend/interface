import { IX2Y2Quote } from '~/types'

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.X2Y2_API_KEY!)

export async function getDataX2y2(nft: string) {
	try {
		const now = Math.floor(Date.now() / 1e3)
		const res = await fetch(`https://loan-api.x2y2.org/v1/offer/list?nftAddress=${nft.toLowerCase()}&tokenId=0`, {
			headers: requestHeaders
		})
			.then((res) => res.json())
			.then((res) => res.data.list)
		const result: IX2Y2Quote[] = []
		res.forEach((res: any) => {
			if (res.expireTime >= now) {
				result.push({
					token: res.erc20Address,
					amount: res.amount,
					repayment: res.repayment,
					apr: res.apr,
					expires: res.expireTime,
					adminFee: res.adminFee,
					duration: res.duration,
					url: 'https://x2y2.io/loan'
				})
			}
		})
		return result
	} catch (error) {
		console.error(`Failed to get X2Y2 data: ${error}`)
		return []
	}
}
