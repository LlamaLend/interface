import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { request, gql } from 'graphql-request'
import { chainConfig, SECONDS_IN_A_DAY, SECONDS_IN_A_YEAR } from '~/lib/constants'
import type { ILoan, ILoanValidity, ITransactionError } from '~/types'
import { getLoansPayableAmount } from '~/utils'

interface IGraphLoanResponse {
	id: string
	loanId: string
	nftId: string
	interest: string
	borrowed: string
	startTime: string
	deadline: string
	tokenUri: string
	owner: string
	pool: {
		name: string
		owner: string
		address: string
	}
}

function infoToRepayLoan(loan: IGraphLoanResponse) {
	const blockTimestamp = Number((Date.now() / 1e3).toFixed(0))

	const deadline = Number(loan.deadline)

	const interestAccrued =
		((blockTimestamp - Number(loan.startTime)) * Number(loan.interest) * Number(loan.borrowed)) / 1e18

	let lateFees = 0

	if (blockTimestamp > deadline) {
		lateFees = ((blockTimestamp - deadline) * Number(loan.borrowed)) / SECONDS_IN_A_DAY
	}

	const total = Number(loan.borrowed) + interestAccrued + lateFees

	// 5%
	const buffer = new BigNumber(total).times(0.05).div(1e18).toFixed(4)

	return {
		initialBorrowed: Number(loan.borrowed),
		apr: (Number(loan.interest) * SECONDS_IN_A_YEAR) / 1e18,
		interestAccrued,
		lateFees,
		buffer,
		total,
		totalPayable: new BigNumber(getLoansPayableAmount(total)).div(1e18).toFixed(4)
	}
}

const userLoansQuery = (userAddress?: string) => gql`
	query {
		loans(where: { originalOwner: "${userAddress?.toLowerCase()}", owner: "${userAddress?.toLowerCase()}" }) {
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

const loansByPoolQuery = (poolAddress: string) => gql`
	query {
		loans(where: { pool: "${poolAddress.toLowerCase()}" }) {
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

const getImgUrls = async (url: string) => {
	const data = await fetch(url).then((res) => res.json())

	return data.image
}

async function getLoans({
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
		if (poolAddress ? false : !userAddress) {
			return []
		}

		if (!endpoint) {
			throw new Error('Error: Invalid arguments')
		}

		const { loans }: { loans: Array<IGraphLoanResponse> } = await request(
			endpoint,
			poolAddress ? loansByPoolQuery(poolAddress) : userLoansQuery(userAddress)
		)

		const loanImgUrls = await Promise.all(loans.map(({ tokenUri }) => (isTestnet ? '' : getImgUrls(tokenUri))))

		return loans
			.filter((pool) => pool.owner !== '0x0000000000000000000000000000000000000000')
			.map((loan, index) => ({
				id: loan.id,
				loanId: loan.loanId,
				nftId: loan.nftId,
				interest: loan.interest,
				startTime: loan.startTime,
				borrowed: loan.borrowed,
				toPay: infoToRepayLoan(loan),
				toPaayBreakdown: {
					initialBorrowed: loan.interest
				},
				deadline: Number(loan.deadline) * 1000,
				imgUrl: isTestnet ? '' : loanImgUrls[index],
				owner: loan.owner,
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

export function useGetLoans({
	chainId,
	userAddress,
	poolAddress
}: {
	chainId?: number | null
	userAddress?: string
	poolAddress?: string
}) {
	const config = chainConfig(chainId)

	return useQuery<Array<ILoan>, ITransactionError>(
		['userLoans', chainId, userAddress, poolAddress],
		() => getLoans({ endpoint: config.subgraphUrl, userAddress, poolAddress, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}

async function getLoanValidity({ poolAddress, loanId, provider, poolABI }: ILoanValidity) {
	if (!poolAddress || !loanId || !provider) {
		throw new Error('Error: Invalid arguments')
	}

	const contract = new ethers.Contract(poolAddress, poolABI, provider)

	return await contract.ownerOf(loanId)
}

async function getLoansToLiquidate({
	liquidatorAddress,
	chainId
}: {
	liquidatorAddress?: string
	chainId?: number | null
}) {
	try {
		if (!liquidatorAddress) {
			return []
		}

		const config = chainConfig(chainId)

		const { liquidators }: { liquidators: Array<{ pool: { address: string } }> } = await request(
			config.subgraphUrl,
			gql`
				query {
					liquidators (where: { address: "${liquidatorAddress.toLowerCase()}" }) {
						pool {
							address
						}
					}
				}
			`
		)

		const pools = liquidators.map((liq) => liq.pool.address)

		const loans = await Promise.all(
			pools.map((poolAddress) => getLoans({ poolAddress, endpoint: config.subgraphUrl, isTestnet: config.isTestnet }))
		)

		const liquidatableLoans: Array<ILoan> = []

		loans.forEach((loan) => {
			loan.forEach((pool) => {
				if (pool.deadline - Date.now() <= 0 && pool.owner !== '0x0000000000000000000000000000000000000000') {
					liquidatableLoans.push(pool)
				}
			})
		})

		const validLoans = await Promise.allSettled(
			liquidatableLoans.map((loan) =>
				getLoanValidity({
					poolAddress: loan.pool.address,
					loanId: loan.loanId,
					provider: config.chainProvider,
					poolABI: config.poolABI
				})
			)
		)

		return liquidatableLoans.filter((_, index) => validLoans[index].status === 'fulfilled')
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export function useGetLoansToLiquidate({
	chainId,
	liquidatorAddress
}: {
	chainId?: number | null
	liquidatorAddress?: string
}) {
	return useQuery<Array<ILoan>, ITransactionError>(
		['loansToLiquidate', chainId, liquidatorAddress],
		() => getLoansToLiquidate({ liquidatorAddress, chainId }),
		{
			refetchInterval: 30_000
		}
	)
}
