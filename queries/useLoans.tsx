import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { chainConfig, SECONDS_IN_A_DAY } from '~/lib/constants'
import type { ILoan, ITransactionError } from '~/types'

interface IGraphLoanResponse {
	loans: Array<{
		id: string
		loanId: string
		nftId: string
		interest: string
		borrowed: string
		startTime: string
		maxLoanLength: string
	}>
}

// function infoToRepayLoan(loan: ILoan) {
// 	const deadline = loan.startTime + loan.maxLoanLength
// 	const interest = ((block.timestamp - loan.startTime) * loan.interest * loan.borrowed) / 1e18
// 	let lateFees = 0
// 	if (block.timestamp > deadline) {
// 		lateFees = ((block.timestamp - deadline) * loan.borrowed) / SECONDS_IN_A_DAY
// 	}

// 	return loan.borrowed + interest + lateFees
// }

async function getLoans({ endpoint, userAddress }: { endpoint: string; userAddress?: string }) {
	try {
		if (!endpoint) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans }: IGraphLoanResponse = await request(
			endpoint,
			gql`
				query {
					loans(where: { originalOwner: "${userAddress}" }) {
            id
            loanId
						nftId
            interest
            borrowed
						deadline
					}
				}
			`
		)
		return loans.map(({ id, loanId, nftId, interest, borrowed }) => ({
			id,
			loanId: Number(loanId),
			nftId: Number(nftId),
			interest: Number(interest),
			borrowed: Number(borrowed),
			deadline: Date.now()
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
