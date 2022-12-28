import { IArcadeQuote } from '~/types'

const collectionsurl = 'https://api-v2.arcade.xyz/api/v2/collections/'
const loantermurl = 'https://api-v2.arcade.xyz/api/v2/loanterms?kind=collection&collectionId'
// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.ARCADE_API_KEY!)

export async function getDataArcade(nft: string) {
	const collections = await fetch(collectionsurl, {
		headers: requestHeaders
	})
		.then((res) => res.json())
		.then((res) => res.filter((res: any) => res.id.toLowerCase() === nft.toLowerCase()))
	if (collections.length === 0 || !collections[0].isVerified) return []
	const now = Math.floor(Date.now() / 1e3)
	const loanterms = await fetch(`${loantermurl}=${nft.toLowerCase()}`, {
		headers: requestHeaders
	}).then((res) => res.json())
	const results: IArcadeQuote[] = []
	loanterms.forEach((item: any) => {
		const time = Math.floor(new Date(item.updatedAt).getTime() / 1e3)
		if (item.role === 'lender' && Number(item.deadline) >= now) {
			results.push({
				borrowableToken: item.payableCurrency,
				principal: item.principal,
				interestRate: item.interestRate,
				loanDuration: item.durationSecs,
				offerDeadline: item.deadline,
				loanInstallments: item.numInstallments,
				offerTimestamp: time,
				loanUrl: `https://app.arcade.xyz/terms/collection/${nft.toLowerCase()}`
			})
		}
	})

	return results
}
