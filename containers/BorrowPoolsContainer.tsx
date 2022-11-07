import Head from 'next/head'
import Link from 'next/link'
import { BorrowPoolItem, PlaceholderBorrowPoolItem } from '~/components/GridItem'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import { useGetAllPools } from '~/queries/useGetAllPools'
import useGetCollectionName from '~/queries/useGetCollectionName'
import { useGetOracle } from '~/queries/useGetOracle'

interface IPoolsContainerProps {
	chainId?: number | null
	chainName?: string | null
	collectionAddress?: string
}

const BorrowPoolsContainer = ({ chainId, chainName, collectionAddress }: IPoolsContainerProps) => {
	const { data: collectionName, isLoading: fetchingName } = useGetCollectionName({ chainId, collectionAddress })

	const { data: oracle, isLoading: fetchingOracle } = useGetOracle({ nftContractAddress: collectionAddress, chainId })

	const { data, isError, isLoading } = useGetAllPools({ chainId, collectionAddress })

	const chainSymbol = chainConfig(chainId)?.nativeCurrency?.symbol

	const floorPrice = oracle?.price ? `FP: ${(Number(oracle.price) / 1e18).toFixed(2)} ${chainSymbol}` : ''

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				<div className="flex flex-wrap justify-between gap-16">
					<h1 className="mt-16 min-h-[2.5rem] text-4xl font-semibold">
						{collectionName ? collectionName + ' Loans' : ''}
					</h1>
					<h1 className="mt-16 min-h-[2.5rem] text-4xl font-semibold opacity-20">{floorPrice}</h1>
				</div>

				<hr className="my-6 border-[#27282A]" />

				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get pools on this networkk.</p>
				) : isLoading ? (
					<div className="flex flex-col gap-5">
						{new Array(4).fill(1).map((_, index) => (
							<PlaceholderBorrowPoolItem key={'plitem' + index} />
						))}
					</div>
				) : data.length === 0 ? (
					<p className="fallback-text">
						{collectionAddress ? (
							<>No pools available on collection {collectionAddress}</>
						) : (
							<>
								There are no pools on {chainName || 'this'} network. Click{' '}
								<Link href="/create">
									<a className="underline">here</a>
								</Link>{' '}
								to create a new pool.
							</>
						)}
					</p>
				) : (
					<div className="flex flex-col gap-5">
						{data.map((item) => (
							<BorrowPoolItem key={item.address} data={item} chainName={chainName} chainId={chainId} />
						))}
					</div>
				)}
			</Layout>
		</>
	)
}

export default BorrowPoolsContainer
