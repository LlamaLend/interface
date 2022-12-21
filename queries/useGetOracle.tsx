import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { chainConfig } from '~/lib/constants'
import type { IOracleResponse, ITransactionError } from '~/types'

interface IFetchOracleProps {
	api: string
	nftContractAddress?: string | null
	isTestnet?: boolean
}

const TEN_MINUTES = 10 * 60 * 1000

const isOracleValid = (res: IOracleResponse, nftContractAddress: string) => {
	if (!res?.price) {
		if (typeof window !== 'undefined') {
			fetch('/api/discord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					collectionAddress: nftContractAddress,
					errorMessage: JSON.stringify(res || {})
				})
			})
		}

		return false
	}

	if (res.deadline * 1000 - Date.now() < TEN_MINUTES) {
		if (typeof window !== 'undefined') {
			fetch('/api/discord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					collectionAddress: nftContractAddress,
					outdatedBy: ((res.deadline * 1000 - Date.now()) / (60 * 1000)).toFixed(2)
				})
			})
		}

		return false
	}

	return true
}

async function fetchOracle({ api, nftContractAddress, isTestnet }: IFetchOracleProps): Promise<IOracleResponse | null> {
	if (!nftContractAddress) {
		return null
	}

	if (isTestnet) {
		return {
			price: '10000000000000000',
			deadline: 1667412882,
			normalizedNftContract: '0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b',
			signature: {
				v: 28,
				r: '0x40a27297766795cb53185f61ccd6b9f3e5355d90b935f7f3e294c2554491c08d',
				s: '0x001174520775424c98a6ecb08cb148e872b5a38ed968e48ac37c19fcc7207dd3'
			}
		}
	}

	try {
		const res = await fetch(`${api}/${getAddress(nftContractAddress)}`).then((res) => res.json())

		const isValid = isOracleValid(res, nftContractAddress)

		if (!isValid) {
			const retryone = await fetch(`${api}/${getAddress(nftContractAddress)}`).then((res) => res.json())

			const isValidRetry = isOracleValid(retryone, nftContractAddress)

			if (!isValidRetry) {
				const retrytwo = await fetch(`${api}/${getAddress(nftContractAddress)}`).then((res) => res.json())

				const isValidQuote = isOracleValid(retrytwo, nftContractAddress)

				if (isValidQuote) {
					return { ...retrytwo, price: retrytwo.price }
				}

				return null
			}

			return { ...retryone, price: retryone.price }
		}

		return { ...res, price: res.price }
	} catch (error: any) {
		if (typeof window !== 'undefined') {
			fetch('/api/discord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					collectionAddress: nftContractAddress,
					errorMessage: JSON.stringify(error || {})
				})
			})
		}

		throw new Error(error.message || (error?.reason ?? "Couldn't fetch quote"))
	}
}

const useGetOracle = ({
	nftContractAddress,
	chainId
}: {
	nftContractAddress?: string | null
	chainId?: number | null
}) => {
	const config = chainConfig(chainId)

	return useQuery<IOracleResponse | null, ITransactionError>(
		['oracle', chainId, nftContractAddress],
		() => fetchOracle({ api: config.quoteApi, nftContractAddress, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}

export { useGetOracle, fetchOracle }
