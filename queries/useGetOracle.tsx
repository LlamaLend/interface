import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { chainConfig } from '~/lib/constants'
import type { IOracleResponse, ITransactionError } from '~/types'

interface IFetchOracleProps {
	api: string
	nftContractAddress?: string | null
	isTestnet?: boolean
}

const failedCollections: {
	[address: string]: number
} = {}

const TEN_MINUTES = 10 * 60 * 1000

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

		// if (!res?.price) {
		// 	throw new Error(`Failed to fetch ${nftContractAddress} oracle`)
		// }

		// if (res.deadline * 1000 - Date.now() < TEN_MINUTES) {
		// 	throw new Error(`${nftContractAddress} quote outdated`)
		// }

		return { ...res, price: res.price }
	} catch (error: any) {
		const message = error.message?.endsWith('quote outdatedd')
			? error.message
			: `Failed to fetch ${nftContractAddress} oracle`

		if (!failedCollections[nftContractAddress] || Date.now() - failedCollections[nftContractAddress] > TEN_MINUTES) {
			failedCollections[nftContractAddress] = Date.now()

			fetch('/api/discord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: '```' + message + '```'
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
