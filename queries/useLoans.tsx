import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { request, gql } from 'graphql-request'
import { chainConfig, SECONDS_IN_A_DAY } from '~/lib/constants'
import type { ILoan, ITransactionError } from '~/types'

interface IGraphLoanResponse {
	id: string
	loanId: string
	nftId: string
	interest: string
	borrowed: string
	startTime: string
	deadline: string
	tokenUri: string
	pool: {
		name: string
		owner: string
		address: string
	}
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

async function getUserLoans({
	endpoint,
	userAddress,
	isTestnet
}: {
	endpoint: string
	userAddress?: string
	isTestnet: boolean
}) {
	try {
		if (!userAddress) {
			return []
		}

		if (!endpoint) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans }: { loans: Array<IGraphLoanResponse> } = await request(
			endpoint,
			gql`
				query {
					loans(where: { originalOwner: "${userAddress.toLowerCase()}", owner: "${userAddress.toLowerCase()}" }) {
            id
            loanId
						nftId
            interest
            borrowed
						startTime
						deadline
						tokenUri
						owner
						originalOwner
						pool {
							name
							owner
							address
						}
					}
				}
			`
		)

		return loans
			.map((loan) => ({
				id: loan.id,
				nftId: loan.nftId,
				interest: loan.interest,
				startTime: loan.startTime,
				borrowed: loan.borrowed,
				toPay: infoToRepayLoan(loan),
				deadline: Number(loan.deadline) * 1000,
				tokenUri: isTestnet ? '' : loan.tokenUri,
				pool: {
					...loan.pool,
					address: getAddress(loan.pool.address)
				}
			}))
			.sort((a, b) => Date.now() - b.deadline - (Date.now() - a.deadline))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export function useGetUserLoans({ chainId, userAddress }: { chainId?: number | null; userAddress?: string }) {
	const config = chainConfig(chainId)

	return useQuery<Array<ILoan>, ITransactionError>(
		['userLoans', chainId, userAddress],
		() => getUserLoans({ endpoint: config.subgraphUrl, userAddress, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}
