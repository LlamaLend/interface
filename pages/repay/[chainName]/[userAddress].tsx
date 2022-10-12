import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import RepayPoolsContainer from '~/containers/RepayPoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
}

const LoansByChain: NextPage<IPageProps> = ({ chainId, chainName, userAddress }) => {
	return <RepayPoolsContainer chainId={chainId} chainName={chainName} userAddress={userAddress} />
}

export default LoansByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = typeof query.chainName === 'string' && query.chainName
	const userAddress = typeof query.userAddress === 'string' && query.userAddress

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !userAddress) {
		return {
			props: {}
		}
	}

	const validUserAddress = userAddress.length === 42 ? userAddress : null

	return {
		props: {
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			userAddress: validUserAddress
		}
	}
}
