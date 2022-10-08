import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { allChains, useNetwork } from 'wagmi'
import LoansContainer from '~/containers/LoansContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
}

// TODO support ens names in  query params
const LoansByChain: NextPage<IPageProps> = ({ chainId, chainName, userAddress }) => {
	const router = useRouter()
	const { chain } = useNetwork()

	const isDefaultRoute = router.asPath === '/loans'

	// only show loans of network user is connected to if they are on /loans, as /loans is similare index route i.e., '/'
	return (
		<LoansContainer
			chainId={chainId || (isDefaultRoute ? chain?.id ?? 1 : null)}
			chainName={chainName || (isDefaultRoute ? chain?.name ?? 'Ethereum' : null)}
			userAddress={userAddress}
		/>
	)
}

export default LoansByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = typeof query.chainName === 'string' && query.chainName
	const address = typeof query.userAddress === 'string' && query.userAddress

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

	return { props: { chainId: chainDetails.id, chainName: chainDetails.name, userAddress: validAddress } }
}
