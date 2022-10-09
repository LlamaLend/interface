import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { allChains, useNetwork } from 'wagmi'
import BorrowPoolsContainer from '~/containers/BorrowPoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
}

const BorrowPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName }) => {
	const router = useRouter()
	const { chain } = useNetwork()

	const isDefaultRoute = router.asPath === '/borrow/pools'

	// only show pools of network user is connected to if they are on /borrow/pools, as /borrow/pools is similare index route i.e., '/'
	return (
		<BorrowPoolsContainer
			chainId={chainId || (isDefaultRoute ? chain?.id ?? 1 : null)}
			chainName={chainName || (isDefaultRoute ? chain?.name ?? 'Ethereum' : null)}
		/>
	)
}

export default BorrowPoolsByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = query.chain?.[0] ?? null

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails) {
		return {
			props: {}
		}
	}

	return { props: { chainId: chainDetails.id, chainName: chainDetails.name } }
}
