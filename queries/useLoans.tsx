import { useQuery } from '@tanstack/react-query'
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
	maxLoanLength: string
	deadline: string
	tokenUri: string
}

function infoToRepayLoan(loan: IGraphLoanResponse) {
	const blockTimestamp = Date.now() / 1e3
	const deadline = Number(loan.startTime) + Number(loan.maxLoanLength)
	const interest = ((blockTimestamp - Number(loan.startTime)) * Number(loan.interest) * Number(loan.borrowed)) / 1e18
	let lateFees = 0
	if (blockTimestamp > deadline) {
		lateFees = ((blockTimestamp - deadline) * Number(loan.borrowed)) / SECONDS_IN_A_DAY
	}

	return Number(loan.borrowed) + interest + lateFees
}

async function getLoans({ endpoint, userAddress }: { endpoint: string; userAddress?: string }) {
	try {
		if (!endpoint) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans }: { loans: Array<IGraphLoanResponse> } = await request(
			endpoint,
			gql`
				query {
					loans(where: { originalOwner: "${userAddress}" }) {
            id
            loanId
						nftId
            interest
            borrowed
						startTime
						deadline
						tokenUri
					}
				}
			`
		)
		return loans.map((loan) => ({
			loanId: Number(loan.loanId),
			toPay: 0,
			deadline: Number(loan.deadline)
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export default function useGetLoans({ chainId, userAddress }: { chainId?: number | null; userAddress?: string }) {
	const config = chainConfig(chainId)

	return useQuery<Array<ILoan>, ITransactionError>(
		['loans', chainId, userAddress],
		() => getLoans({ endpoint: config.subgraphUrl, userAddress }),
		{
			refetchInterval: 30_000
		}
	)
}
