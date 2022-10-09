import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { allChains, useAccount, useNetwork } from 'wagmi'
import RepayPoolsContainer from '~/containers/RepayPoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
}

const RepayPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName }) => {
	const router = useRouter()
	const { chain } = useNetwork()
	const { address } = useAccount()

	const isDefaultRoute = router.asPath === '/repay/pools'

	// only show loans of network user is connected to if they are on /repay/pools, as /repay/pools is similare index route i.e., '/repay'
	return (
		<RepayPoolsContainer
			chainId={chainId || (isDefaultRoute ? chain?.id ?? 1 : null)}
			chainName={chainName || (isDefaultRoute ? chain?.name ?? 'Ethereum' : null)}
			userAddress={address}
		/>
	)
}

export default RepayPoolsByChain

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
