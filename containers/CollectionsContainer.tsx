import Head from 'next/head'
import { BorrowCollectionItem } from '~/components/GridItem/Collection'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { useGetAllCollections } from '~/queries/useGetAllCollections'

interface ICollectionContainerProps {
	chainId: number
	chainName: string
}

const CollectionsContainer = ({ chainId, chainName }: ICollectionContainerProps) => {
	const { data: collections } = useGetAllCollections({ chainId, skipOracle: true })
	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : collections?.length === 0 ? (
					<p className="fallback-text">There are no collections on {chainName || 'this'} network.</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto !place-content-around sm:my-9 2xl:!place-content-between">
						{collections?.map((item) => (
							<BorrowCollectionItem key={item.address} data={item} chainName={chainName} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default CollectionsContainer
