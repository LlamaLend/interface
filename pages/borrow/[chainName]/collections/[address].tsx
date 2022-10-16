import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import BorrowPoolsContainer from '~/containers/BorrowPoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	collectionAddress?: string
}

const BorrowPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName, collectionAddress }) => {
	return <BorrowPoolsContainer chainId={chainId} chainName={chainName} collectionAddress={collectionAddress} />
}

export default BorrowPoolsByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = typeof query.chainName === 'string' && query.chainName
	const address = typeof query.address === 'string' && query.address

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !address) {
		return {
			props: {}
		}
	}

	const validAddress = address.length === 42 ? address : null

	return { props: { chainId: chainDetails.id, chainName: chainDetails.name, collectionAddress: validAddress } }
}
