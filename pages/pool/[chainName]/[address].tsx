import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'

interface IPageProps {
	chainId?: number
	chainName?: string
	address?: string
}

const PoolByChain: NextPage<IPageProps> = ({ chainId, chainName, address }) => {
	return (
		<Layout>
			<GridWrapper>
				<></>
			</GridWrapper>
		</Layout>
	)
}

export default PoolByChain

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const chainParam = typeof query.chainName === 'string' && query.chainName
	const address = typeof query.address === 'string' && query.address

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !address) {
		return { props: {} }
	}

	return { props: { chainId: chainDetails.id, chainName: chainDetails.name, address } }
}
