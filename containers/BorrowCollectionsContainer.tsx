import Head from 'next/head'
import { BorrowCollectionItem } from '~/components/GridItem/Collection'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import type { ICollection } from '~/types'

interface ICollectionContainerProps {
	chainId: number
	chainName: string
	collections: Array<ICollection>
}

const BorrowCollectionsContainer = ({ chainId, chainName, collections }: ICollectionContainerProps) => {
	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No collections on {chainName || 'this network'}.</p>
				) : collections.length === 0 ? (
					<p className="fallback-text">There are no collections on {chainName || 'this'} network.</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{collections.map((item) => (
							<BorrowCollectionItem key={item.address} data={item} chainName={chainName} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default BorrowCollectionsContainer
