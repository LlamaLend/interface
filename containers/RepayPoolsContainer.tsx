import Head from 'next/head'
import Link from 'next/link'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { RepayPoolItem, PlaceholderRepayPoolItem } from '~/components/GridItem'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import { useGetRepayPools } from '~/queries/useLoans'

interface ILoansContainerProps {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function LoanPoolsContainer({ chainId, chainName, userAddress }: ILoansContainerProps) {
	const { openConnectModal } = useConnectModal()

	const { data, isLoading, isError } = useGetRepayPools({ chainId, userAddress })

	const chainSymbol = chainConfig(chainId).nativeCurrency?.symbol

	return (
		<>
			<Head>
				<title>Repay - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : !userAddress ? (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect</button> your wallet to view loans.
					</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get loans.</p>
				) : isLoading ? (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{new Array(10).fill(1).map((_, index) => (
							<PlaceholderRepayPoolItem key={'rplitem' + index} />
						))}
					</GridWrapper>
				) : data.length === 0 ? (
					<p className="fallback-text">
						You don't have any loans, Click{' '}
						<Link href="/">
							<a className="underline">here</a>
						</Link>{' '}
						to borrow {chainSymbol}.
					</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{data.map((pool) => (
							<RepayPoolItem data={pool} chainName={chainName} key={pool.address} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}
