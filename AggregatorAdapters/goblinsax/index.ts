import { IGoblinSaxQuote } from '~/types'

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.GOBLIN_SAX_API_KEY as string)

export async function getDataGoblinSax(nft: string) {
	try {
		const res = await fetch(
			`https://mainnet-api.goblinsax.xyz/api/get-loan-terms?address=${nft.toLowerCase()}&id=0&borrowerAddress=0x0`,
			{
				headers: requestHeaders
			}
		).then((res) => res.json())

		if (!res.success) return []
		const result: IGoblinSaxQuote[] = []
		const offers = res.body.offers
		Object.keys(offers).forEach((duration: string) => {
			offers[duration].forEach((offer: any) => {
				result.push({
					token: 'WETH',
					price: res.body.price,
					url: 'https://loans.goblinsax.xyz/',
					ltv: offer.LTV,
					apr: offer.APR,
					fee: offer.FEE,
					loanPrincipal: offer.loanPrincipal,
					loanRepayment: offer.loanRepayment,
					duration: parseInt(duration).toString()
				})
			})
		})
		res.body.offers
		return result
	} catch (error) {
		console.error(`Failed to get GoblinSax data: ${error}`)
		return []
	}
}

export async function getGoblinSaxCollections() {
	try {
		const res = await fetch('https://mainnet-api.goblinsax.xyz/api/whitelist', {
			headers: requestHeaders
		}).then((res) => res.json())

		if (!res.success) throw new Error('Unsuccessful Goblin Sax collections calls')
		return res.whitelist.map((col: any) => col.asset_contract)
	} catch (error) {
		console.error(`Failed to get GoblinSax collections: ${error}`)
		return []
	}
}
