import Head from 'next/head'
import Link from 'next/link'
import { BorrowPoolItem, PlaceholderBorrowPoolItem } from '~/components/GridItem'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { useGetAllPools } from '~/queries/useGetAllPools'

interface IPoolsContainerProps {
	chainId?: number | null
	chainName?: string | null
	collectionAddress?: string
}

const BorrowPoolsContainer = ({ chainId, chainName, collectionAddress }: IPoolsContainerProps) => {
	const { data, isError, isLoading } = useGetAllPools({ chainId, collectionAddress })

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get pools on this networkk.</p>
				) : isLoading ? (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{new Array(10).fill(1).map((_, index) => (
							<PlaceholderBorrowPoolItem key={'plitem' + index} />
						))}
					</GridWrapper>
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
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{data.map((item) => (
							<BorrowPoolItem key={item.address} data={item} chainName={chainName} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default BorrowPoolsContainer
