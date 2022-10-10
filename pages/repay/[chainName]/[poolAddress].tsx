import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { allChains, useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Layout from '~/components/Layout'
import GridWrapper from '~/components/GridWrapper'
import { RepayNftItem, RepayNftPlaceholder } from '~/components/GridItem/Repay'
import { useGetLoansByPool } from '~/queries/useLoans'
import { RepayCart } from '~/components/Cart'

interface IPageProps {
	chainId?: number
	chainName?: string
	userAddress?: string
	poolAddress?: string
}

const LoansByChain: NextPage<IPageProps> = ({ chainId, chainName, poolAddress }) => {
	const { address } = useAccount()

	const { openConnectModal } = useConnectModal()

	const { data, isLoading, isError } = useGetLoansByPool({ chainId, poolAddress, userAddress: address })

	return (
		<>
			<Head>
				<title>Repay - LlamaLend</title>
			</Head>

			<Layout className="flex-1 xl:flex xl:flex-row xl:justify-between xl:gap-5">
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : !address ? (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect</button> your wallet to view loans.
					</p>
				) : !poolAddress ? (
					<p className="fallback-text">Not found, Plase check URL validity</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get loans.</p>
				) : isLoading ? (
					<GridWrapper className="mx-0 mt-8 mb-auto flex-1 sm:my-9">
						{new Array(10).fill(1).map((_, index) => (
							<RepayNftPlaceholder key={'rplitem' + index} />
						))}
					</GridWrapper>
				) : data.length === 0 ? (
					<p className="fallback-text">You don't have any loans in this pool.</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto flex-1 sm:my-9">
						{data.map((item) => (
							<RepayNftItem key={item.id} data={item} poolAddress={poolAddress} />
						))}
					</GridWrapper>
				)}

				<RepayCart
					loanPoolAddress={poolAddress}
					chainId={chainId}
					loanPoolName={data?.[0]?.pool?.name ?? ''}
					isLoading={isLoading}
				/>
			</Layout>
		</>
	)
}

export default LoansByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = typeof query.chainName === 'string' && query.chainName
	const poolAddress = typeof query.poolAddress === 'string' && query.poolAddress

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !poolAddress) {
		return {
			props: {}
		}
	}

	const validPoolAddress = poolAddress.length === 42 ? poolAddress : null

	return {
		props: {
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			poolAddress: validPoolAddress
		}
	}
}
