import { IArcadeQuote } from '~/types'

const loantermurl = 'https://api-v2.arcade.xyz/api/v2/loanterms?kind=collection&collectionId'
// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.ARCADE_API_KEY as string)

export async function getDataArcade(nft: string) {
	try {
		const collections = await getArcadeCollections().then((res) =>
			res.filter((res: any) => res.toLowerCase() === nft.toLowerCase())
		)

		if (collections.length === 0) return []

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
	} catch (error) {
		console.error(`Failed to get arcade info: ${error}`)
		return []
	}
}

interface ILendRes {
	collateralAddress: string
	deadline: string
	role: string
}

export async function getArcadeCollections() {
	try {
		const res = await fetch(
			`http://api-v2.arcade.xyz/api/v2/lend
		`,
			{
				headers: requestHeaders
			}
		)
			.then((res) => res.json())
			.then((res: Array<{ loanTerms: Array<ILendRes> }>) =>
				res.reduce((acc, curr) => {
					acc = [...acc, ...curr.loanTerms]
					return acc
				}, [] as Array<ILendRes>)
			)
			.then((res) =>
				res.reduce((acc, curr) => {
					if (curr.role === 'lender' && Number(curr.deadline) * 1000 > Date.now()) {
						acc.add(curr.collateralAddress.toLowerCase())
					}
					return acc
				}, new Set() as Set<string>)
			)

		return Array.from(res)
	} catch (error) {
		console.error(`Failed to get arcade collections: ${error}`)
		return []
	}
}
