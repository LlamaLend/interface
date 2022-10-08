import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { chainConfig } from '~/lib/constants'
import type { ITransactionError } from '~/types'

async function getLoans({ endpoint, userAddress }: { endpoint: string; userAddress?: string }) {
	try {
		if (!endpoint) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans } = await request(
			endpoint,
			gql`
				query {
					loans(where: { originalOwner: "${userAddress}" }) {
						nftId
					}
				}
			`
		)
		return loans
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export default function useGetLoans({ chainId, userAddress }: { chainId?: number | null; userAddress?: string }) {
	const config = chainConfig(chainId)

	return useQuery<any, ITransactionError>(
		['loans', chainId, userAddress],
		() => getLoans({ endpoint: config.subgraphUrl, userAddress }),
		{
			refetchInterval: 30_000
		}
	)
}
