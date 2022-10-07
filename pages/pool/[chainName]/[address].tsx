import type { GetServerSideProps, NextPage } from 'next'
import { allChains, useAccount } from 'wagmi'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Head from 'next/head'
import { cx } from 'cva'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import GridWrapper from '~/components/GridWrapper'
import { BorrowNftItem, BorrowNftPlaceholder } from '~/components/GridItem/Borrow'
import Layout from '~/components/Layout'
import { useGetPoolData } from '~/queries/useGetPoolData'
import { useGetNftsList } from '~/queries/useNftsList'
import { chainConfig, SECONDS_IN_A_YEAR } from '~/lib/constants'
import { useGetQuote } from '~/queries/useGetQuote'

// @ts-ignore
dayjs.extend(relativeTime)

interface IPageProps {
	chainId?: number
	chainName?: string
	address?: string
	chainSymbol: string
}

const PoolByChain: NextPage<IPageProps> = ({ chainId, address, chainSymbol }) => {
	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()

	const { data, isLoading } = useGetPoolData({ chainId, address })

	const { data: quote, isLoading: quoteLoading } = useGetQuote(address)

	const { data: nftsList, isLoading: nftsListLoading } = useGetNftsList(data?.nftContract)

	const config = chainConfig(chainId)

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout className="relative">
				<div className="px-3 py-6 bg-[#111111] rounded-xl shadow">
					<div className="rounded-full mx-auto h-24 w-24 bg-gradient-to-r from-[#141e30] to-[#243b55]"></div>

					<h1
						className={cx(
							'text-center text-2xl font-medium my-2 min-h-[2rem]',
							isLoading ? 'mx-auto placeholder-box w-full max-w-[22rem]' : ''
						)}
					>
						{data?.nftName ?? ''}
					</h1>

					<a
						className={cx(
							'text-sm mx-auto mb-10 break-all min-h-[2rem] flex items-center',
							isLoading ? 'placeholder-box w-full max-w-[22rem]' : 'w-fit'
						)}
						target="_blank"
						rel="noreferrer noopener"
						href={`${config.blockExplorer.url}/address/${data?.nftContract}`}
					>
						<span className="bg-[#202020] px-1 py-0.5 rounded">{data?.nftContract ?? ''}</span>
					</a>

					<div className="flex flex-col justify-center gap-4 xl:flex-row xl:items-center max-w-md lg:max-w-xl  xl:max-w-7xl mx-auto">
						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020] flex-1">
							<h2 className="text-center font-medium">Pool Name</h2>
							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? data.name : ''}
							</p>
						</div>

						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020] flex-1">
							<h2 className="text-center font-medium">Current Annual Interest</h2>
							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? `${(data.currentAnnualInterest / 1e16).toFixed(2)}% p.a.` : ''}
							</p>
						</div>

						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020] flex-1">
							<h2 className="text-center font-medium">Maximum Annual Interest</h2>

							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? `${(data.maxInterestPerEthPerSecond / (10 * SECONDS_IN_A_YEAR)).toFixed(2)}% p.a.` : ''}
							</p>
						</div>

						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020] flex-1">
							<h2 className="text-center font-medium">Maximum Loan Duration</h2>

							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data
									? // @ts-ignore
									  `${dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}`
									: ''}
							</p>
						</div>
					</div>
				</div>

				<div className="flex-1 min-h-[60rem]">
					{!chainId ? (
						<p className="fallback-text">Network not supported, Please check URL validity.</p>
					) : isLoading || nftsListLoading || quoteLoading ? (
						<GridWrapper>
							{new Array(10).fill(1).map((_, index) => (
								<BorrowNftPlaceholder key={'plitem' + index} />
							))}
						</GridWrapper>
					) : !data?.name ? (
						<p className="fallback-text">Pool not found.</p>
					) : !isConnected ? (
						<p className="fallback-text">
							<button onClick={openConnectModal}>Connect</button> your wallet to view the NFTs you can use to borrow{' '}
							{chainSymbol}.
						</p>
					) : !nftsList ? (
						<p className="fallback-text">Something went wrong, couldn't fetch your NFTs.</p>
					) : nftsList.length === 0 ? (
						<p className="fallback-text">There are no {data.nftName} in this address.</p>
					) : (
						<GridWrapper>
							{nftsList.map((nftData) => (
								<BorrowNftItem
									key={nftData.tokenId}
									data={nftData}
									quotePrice={quote?.price}
									contractAddress={data.nftContract}
								/>
							))}
						</GridWrapper>
					)}
				</div>
			</Layout>
		</>
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

	const validAddress = address.length === 42 ? address : null

	// const config = chainConfig(chainDetails.id)

	// const queryClient = new QueryClient()

	// await queryClient.prefetchQuery(['pool', chainDetails.id, address], () =>
	// 	getPool({
	// 		chainId: chainDetails.id,
	// 		contractArgs: validAddress ? { address: validAddress, provider: config.chainProvider, abi: config.poolABI } : null
	// 	})
	// )

	return {
		props: {
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			address: validAddress,
			chainSymbol: chainDetails.nativeCurrency?.symbol ?? 'ETH'
		}
	}
}
