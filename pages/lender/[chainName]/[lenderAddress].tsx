import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import LenderStatsContainer from '~/containers/LenderContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	lenderAddress?: string
}

const LoansByChain: NextPage<IPageProps> = (props) => {
	return <LenderStatsContainer {...props} />
}

export default LoansByChain

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const chainParam = typeof query.chainName === 'string' && query.chainName
	const lenderAddress = typeof query.lenderAddress === 'string' && query.lenderAddress

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !lenderAddress) {
		return {
			props: {}
		}
	}

	const validAddress = lenderAddress.length === 42 ? lenderAddress : null

	return {
		props: {
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			lenderAddress: validAddress
		}
	}
}

export const config = {
	runtime: 'experimental-edge'
}
