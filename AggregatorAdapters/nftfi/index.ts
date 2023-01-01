import { INFTFiQuote } from '~/types'

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.NFTFI_API_KEY!)

export async function getDataNftFi(nft: string) {
	const now = Math.floor(Date.now() / 1e3)
	try {
		const res = await fetch(
			`https://sdk-api.nftfi.com/offers?nftAddress=${nft.toLowerCase()}&contractName=v2.loan.fixed.collection`,
			{
				headers: requestHeaders
			}
		)
			.then((res) => res.json())
			.then((res) => res.results)
		const result: INFTFiQuote[] = []
		res.forEach((e: any) => {
			if (e.terms.loan.expiry >= now) {
				result.push({
					token: e.terms.loan.currency,
					principal: e.terms.loan.principal,
					repayment: e.terms.loan.repayment,
					duration: e.terms.loan.duration,
					expiry: e.terms.loan.expiry,
					interest: e.terms.loan.interest.bps,
					url: `https://app.nftfi.com/collection/${nft.toLowerCase()}`
				})
			}
		})
		return result
	} catch (error) {
		console.error(`Failed to get NFTFi data: ${error}`)
		return []
	}
}
