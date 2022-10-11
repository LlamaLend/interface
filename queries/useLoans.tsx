import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { chainConfig, SECONDS_IN_A_DAY } from '~/lib/constants'
import type { ILoan, IRepayPool, ITransactionError } from '~/types'

interface IGraphLoanResponse {
	id: string
	loanId: string
	nftId: string
	interest: string
	borrowed: string
	startTime: string
	deadline: string
	tokenUri: string
	pool?: {
		name: string
	}
}

interface IGraphLoanPoolsResponse {
	pools: Array<{
		name: string
		address: string
		loans: Array<String>
	}>
}

function infoToRepayLoan(loan: IGraphLoanResponse) {
	const blockTimestamp = Number((Date.now() / 1e3).toFixed(0))

	const deadline = Number(loan.deadline)

	const interest = ((blockTimestamp - Number(loan.startTime)) * Number(loan.interest) * Number(loan.borrowed)) / 1e18

	let lateFees = 0

	if (blockTimestamp > deadline) {
		lateFees = ((blockTimestamp - deadline) * Number(loan.borrowed)) / SECONDS_IN_A_DAY
	}

	return Number(loan.borrowed) + interest + lateFees
}

async function getRepayPools({ endpoint, userAddress }: { endpoint: string; userAddress?: string }) {
	try {
		if (!endpoint || !userAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const { pools }: IGraphLoanPoolsResponse = await request(
			endpoint,
			gql`
				query {
					pools (where: { owner: "${userAddress.toLowerCase()}" }) {
            name
						address
						loans
					}
				}
			`
		)

		return pools.map((pool) => ({ name: pool.name, address: pool.address, loans: pool.loans.length }))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

async function getLoansByPool({
	endpoint,
	userAddress,
	poolAddress,
	isTestnet
}: {
	endpoint: string
	userAddress?: string
	poolAddress?: string
	isTestnet: boolean
}) {
	try {
		if (!userAddress) {
			return []
		}

		if (!endpoint || !poolAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans }: { loans: Array<IGraphLoanResponse> } = await request(
			endpoint,
			gql`
				query {
					loans(where: { originalOwner: "${userAddress.toLowerCase()}", pool: "${poolAddress.toLowerCase()}" }) {
            id
            loanId
						nftId
            interest
            borrowed
						startTime
						deadline
						tokenUri
						pool {
							name
						}
					}
				}
			`
		)

		return loans.map((loan) => ({
			id: loan.id,
			interest: loan.interest,
			startTime: loan.startTime,
			borrowed: loan.borrowed,
			toPay: infoToRepayLoan(loan),
			deadline: Number(loan.deadline) * 1000,
			tokenUri: isTestnet ? '' : loan.tokenUri,
			pool: {
				name: loan.pool?.name
			}
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export function useGetRepayPools({ chainId, userAddress }: { chainId?: number | null; userAddress?: string }) {
	const config = chainConfig(chainId)

	return useQuery<Array<IRepayPool>, ITransactionError>(
		['repayPools', chainId, userAddress],
		() => getRepayPools({ endpoint: config.subgraphUrl, userAddress }),
		{
			refetchInterval: 30_000
		}
	)
}

export function useGetLoansByPool({
	chainId,
	poolAddress,
	userAddress
}: {
	chainId?: number | null
	poolAddress?: string
	userAddress?: string
}) {
	const config = chainConfig(chainId)

	return useQuery<Array<ILoan>, ITransactionError>(
		['loansByPool', chainId, poolAddress, userAddress],
		() => getLoansByPool({ endpoint: config.subgraphUrl, userAddress, poolAddress, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}
