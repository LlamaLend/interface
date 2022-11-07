import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { chainConfig } from '~/lib/constants'
import { IOracleResponse, ITransactionError } from '~/types'

interface IFetchOracleProps {
	api: string
	nftContractAddress?: string | null
	isTestnet?: boolean
}

async function fetchOracle({ api, nftContractAddress, isTestnet }: IFetchOracleProps): Promise<IOracleResponse | null> {
	try {
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

		const res = await fetch(`${api}/${getAddress(nftContractAddress)}`).then((res) => res.json())

		return { ...res, price: res.price }
	} catch (error: any) {
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
