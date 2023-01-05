import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import RepayPoolsContainer from '~/containers/RepayPoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
}

const LoansByChain: NextPage<IPageProps> = (props) => {
	return <RepayPoolsContainer {...props} />
}

export default LoansByChain

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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

export const config = {
	runtime: 'experimental-edge'
}
