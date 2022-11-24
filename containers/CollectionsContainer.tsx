import Head from 'next/head'
import { BorrowCollectionItem } from '~/components/Collection'
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
					<ul className="mx-0 mt-8 mb-auto grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] place-content-around gap-8 sm:my-9 2xl:place-content-between">
						{collections?.map((item) => (
							<BorrowCollectionItem key={item.address} data={item} chainName={chainName} />
						))}
					</ul>
				)}
			</Layout>
		</>
	)
}

export default CollectionsContainer
