import Head from 'next/head'
import { BorrowCollectionItem } from '~/components/GridItem/Collection'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import collections from '~/lib/collections'

interface IPoolsContainerProps {
	chainId?: number | null
	chainName?: string | null
	collectionAddress?: string
}

const BorrowCollectionsContainer = ({ chainId, chainName }: IPoolsContainerProps) => {
	const data = chainId ? collections[chainId] || [] : []

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : data.length === 0 ? (
					<p className="fallback-text">There are no collections on {chainName || 'this'} network.</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{data.map((item) => (
							<BorrowCollectionItem key={item.address} data={item} chainName={chainName} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default BorrowCollectionsContainer
