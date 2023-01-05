import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import ManagePoolsContainer from '~/containers/ManagePoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
}

const Manage: NextPage<IPageProps> = (props) => {
	return <ManagePoolsContainer {...props} />
}

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

export default Manage
