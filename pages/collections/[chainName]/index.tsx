import type { NextPage } from 'next'
import { allChains } from 'wagmi'
import BorrowCollectionsContainer from '~/containers/BorrowCollectionsContainer'
import { getAllCollections } from '~/queries/useGetAllCollections'
import type { ICollection } from '~/types'

interface IPageProps {
	chainId: number
	chainName: string
	collections: Array<ICollection>
}

const BorrowPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName, collections }) => {
	// only show pools of network user is connected to if they are on /borrow/collections
	return <BorrowCollectionsContainer chainId={chainId} chainName={chainName} collections={collections} />
}

export default BorrowPoolsByChain

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { chainName: 'ethereum' } },
			{ params: { chainName: '1' } },
			{ params: { chainName: 'goerli' } },
			{ params: { chainName: '5' } }
		],
		fallback: 'blocking'
	}
}

export async function getStaticProps({ params: { chainName } }: { params: { chainName: string } }) {
	const chainDetails = chainName
		? allChains.find((chain) => chain.id === Number(chainName) || chain.name.toLowerCase() === chainName.toLowerCase())
		: null

	if (!chainDetails) {
		return { notFound: true }
	}

	const collections = await getAllCollections({ chainId: chainDetails.id })

	return {
		props: { collections, chainId: chainDetails.id, chainName: chainDetails.name },
		revalidate: 30
	}
}
