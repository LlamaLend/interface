import { IZhartaQuote } from '~/types'

const collections = new Map<string, [number, number, number]>()
collections.set('0xed5af388653567af2f388e6224dc7c4b3241c544', [9278, 3309, 55])
collections.set('0xba30e5f9bb24caa003e9f2f0497ad287fdf95623', [6129, 4041, 50])
collections.set('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', [5777, 441, 60])
collections.set('0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949', [7207, 9466, 40])
collections.set('0x059edd72cd353df5106d2b9cc5ab83a52287ac3a', [9578, 6667, 60])
collections.set('0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', [15886, 19170, 55])
collections.set('0x1a92f7381b9f03921564a437210bb9396471050c', [3785, 500, 40])
collections.set('0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', [5151, 2912, 55])
collections.set('0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270', [215000961, 78000723, 55])
collections.set('0xc2c747e0f7004f9e8817db2ca4997657a7746928', [7187, 9939, 40])
collections.set('0x524cab2ec69124574082676e6f654a18df49a048', [9083, 1721, 40])
collections.set('0x60e4d786628fea6478f785a6d7e704777c86a7c6', [21050, 30002, 55])
collections.set('0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7', [4985, 6863, 50])
collections.set('0x23581767a106ae21c074b2276d25e5c3e136a68b', [5144, 668, 55])
collections.set('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', [52516, 60324, 55])
collections.set('0xbd3531da5cf5857e7cfaa92426877b022e612cf8', [5359, 7365, 55])
collections.set('0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', [703, 463, 60])
collections.set('0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb', [525, 8524, 40])
collections.set('0xe785e82358879f061bc3dcac6f0444462d4b5330', [2187, 35, 40])
collections.set('0xb7f7f6c52f2e2fdb1963eab30438024864c313f6', [703, 463, 60])

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('content-type', 'application/json')

export async function getDataZharta(collectionAddress: string) {
	try {
		const collection = collections.get(collectionAddress.toLowerCase())

		if (collection !== undefined) {
			const fpToken = collection[0]
			const rareToken = collection[1]
			const ltv = collection[2]

			const resBorrowAmounts = await fetch(`https://api.zharta.io/loans/v2/conditions`, {
				method: 'POST',
				body: JSON.stringify({
					collaterals: [
						{
							contract_address: collectionAddress,
							token_id: fpToken
						},
						{
							contract_address: collectionAddress,
							token_id: rareToken
						}
					]
				}),
				headers: requestHeaders
			}).then((resBorrowAmounts) => resBorrowAmounts.json())

			const result: IZhartaQuote[] = [
				{
					currency: 'ETH',
					minBorrowableAmount: resBorrowAmounts.collaterals[0].max_value,
					maxBorrowableAmount: resBorrowAmounts.collaterals[1].max_value,
					interestRate: resBorrowAmounts.interest_rate,
					interestRateApr: (resBorrowAmounts.interest_rate / 30) * 365,
					ltv: ltv,
					duration: 30 * 86400,
					url: 'https://app.zharta.io/borrow'
				}
			]

			return result
		} else {
			return []
		}
	} catch (error) {
		console.error(`Failed to get Zharta data: ${error}`)
		return []
	}
}

export async function getZhartaCollections() {
	try {
		const result: string[] = []
		collections.forEach((_, key) => {
			result.push(key)
		})

		return result
	} catch (error) {
		console.error(`Failed to get Zharta collections: ${error}`)
		return []
	}
}
