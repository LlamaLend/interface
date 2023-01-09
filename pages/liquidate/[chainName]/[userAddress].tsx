import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import LiquidateContainer from '~/containers/LiquidateContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
}

const LoansToLiquidateByChain: NextPage<IPageProps> = (props) => {
	return <LiquidateContainer {...props} />
}

export default LoansToLiquidateByChain

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
