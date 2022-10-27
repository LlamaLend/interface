import Head from 'next/head'
import Link from 'next/link'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Layout from '~/components/Layout'
import { useGetAllPools } from '~/queries/useGetAllPools'
import LenderPool from './Pool'

interface ILoansContainerProps {
	chainId?: number | null
	chainName?: string | null
	lenderAddress?: string
}

export default function LenderStatsContainer({ chainId, chainName, lenderAddress }: ILoansContainerProps) {
	const { openConnectModal } = useConnectModal()

	const { data, isError } = useGetAllPools({ chainId, ownerAddress: lenderAddress })

	return (
		<>
			<Head>
				<title>Lender - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : !lenderAddress ? (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect</button> your wallet to view pools.
					</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get pools.</p>
				) : data?.length === 0 ? (
					<p className="fallback-text">
						You don't have any pools, Click{' '}
						<Link href="/create">
							<a className="underline">here</a>
						</Link>{' '}
						to create.
					</p>
				) : (
					<>
						{data?.map((pool) => (
							<LenderPool key={pool.address} pool={pool} chainId={chainId} />
						))}
					</>
				)}
			</Layout>
		</>
	)
}
