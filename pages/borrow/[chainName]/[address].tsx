import type { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import { allChains, useAccount } from 'wagmi'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Head from 'next/head'
import { cx } from 'cva'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import GridWrapper from '~/components/GridWrapper'
import { BorrowNftItem, BorrowNftPlaceholder } from '~/components/GridItem/Borrow'
import Layout from '~/components/Layout'
import { BorrowCart } from '~/components/Cart'
import { useGetPoolData } from '~/queries/useGetPoolData'
import { useGetNftsList } from '~/queries/useNftsList'
import { chainConfig } from '~/lib/constants'
import { formatCurrentAnnualInterest } from '~/utils'
import { useGetOracle } from '~/queries/useGetOracle'
import pools from '~/lib/pools'

// @ts-ignore
dayjs.extend(relativeTime)

interface IPageProps {
	chainId?: number
	chainName?: string
	poolAddress?: string
	chainSymbol: string
}

const PoolByChain: NextPage<IPageProps> = ({ chainId, chainName, poolAddress, chainSymbol }) => {
	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()

	const { data, isLoading } = useGetPoolData({ chainId, poolAddress })

	const { data: oracle, isLoading: fetchingOracle } = useGetOracle({ nftContractAddress: data?.nftContract, chainId })

	const { data: nftsList, isLoading: nftsListLoading } = useGetNftsList({
		nftContractAddress: data?.nftContract,
		chainId
	})

	const config = chainConfig(chainId)

	const poolOwner = pools[chainId || 1]?.find(
		(pool) => pool.poolAddress.toLowerCase() === poolAddress?.toLowerCase()
	)?.ownerName

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout className="relative">
				<div className="rounded-xl bg-[#111111] px-3 py-6 shadow">
					<div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55]"></div>

					<a
						className={cx(
							'my-2 mx-auto block min-h-[2rem] text-center text-2xl font-medium',
							isLoading ? 'placeholder-box mx-auto w-full max-w-[22rem]' : 'w-fit'
						)}
						target="_blank"
						rel="noreferrer noopener"
						href={`${config.blockExplorer.url}/address/${data?.nftContract}`}
					>
						{data?.nftName ?? ''}
					</a>

					<a
						className={cx(
							'mx-auto mb-10 flex min-h-[2rem] items-center break-all text-sm',
							isLoading ? 'placeholder-box w-full max-w-[22rem]' : 'w-fit'
						)}
						target="_blank"
						rel="noreferrer noopener"
						href={`${config.blockExplorer.url}/address/${data?.owner}`}
					>
						{data ? (
							<span className="rounded bg-[#202020] px-1 py-0.5">{`${data.name} by ${poolOwner || data.owner}`}</span>
						) : (
							''
						)}
					</a>

					<div className="mx-auto flex max-w-xl flex-col flex-wrap justify-center gap-4 md:flex-row  xl:max-w-7xl xl:items-center">
						<div className="flex flex-1 flex-col items-center gap-4 rounded-xl bg-[#202020] px-8 py-4">
							<h2 className="text-center font-medium md:whitespace-nowrap">Current Annual Interest</h2>
							<p
								className={cx(
									'min-h-[1.5rem] font-mono text-[#F6F6F6]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? `${formatCurrentAnnualInterest(data.currentAnnualInterest)}% APR` : ''}
							</p>
						</div>

						<div className="flex flex-1 flex-col items-center gap-4 rounded-xl bg-[#202020] px-8 py-4">
							<h2 className="text-center font-medium md:whitespace-nowrap">Maximum NFTs to borrow</h2>

							<p
								className={cx(
									'min-h-[1.5rem] font-mono text-[#F6F6F6]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? data.maxNftsToBorrow : ''}
							</p>
						</div>

						<div className="flex flex-1 flex-col items-center gap-4 rounded-xl bg-[#202020] px-8 py-4">
							<h2 className="text-center font-medium md:whitespace-nowrap">Loan-to-Value</h2>

							<p
								className={cx(
									'min-h-[1.5rem] font-mono text-[#F6F6F6]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{data ? data.ltv / 1e16 + '%' : ''}
							</p>
						</div>

						<div className="flex flex-1 flex-col items-center gap-4 rounded-xl bg-[#202020] px-8 py-4">
							<h2 className="text-center font-medium">Maximum Loan Duration</h2>

							<p
								className={cx(
									'min-h-[1.5rem] font-mono text-[#F6F6F6]',
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

				<div className="min-h-screen flex-1 py-6 xl:flex xl:justify-between xl:gap-5">
					<React.Suspense fallback={null}>
						<>
							{!chainId ? (
								<p className="fallback-text">Network not supported, Please check URL validity.</p>
							) : isLoading || nftsListLoading || fetchingOracle ? (
								<GridWrapper className="xl:flex-1">
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
								<p className="fallback-text">
									There are no {data.nftName} in this address on {chainName}.
								</p>
							) : (
								<GridWrapper className="xl:flex-1">
									{nftsList.map((nftData) => (
										<BorrowNftItem
											key={nftData.tokenId}
											data={nftData}
											oraclePrice={oracle?.price ?? 0}
											ltv={data.ltv}
											contractAddress={data.nftContract}
											chainId={chainId}
										/>
									))}
								</GridWrapper>
							)}

							<BorrowCart
								poolAddress={poolAddress}
								chainId={chainId}
								nftContractAddress={data?.nftContract}
								nftCollectionName={data?.nftName}
								isLoading={isLoading || nftsListLoading || fetchingOracle}
							/>
						</>
					</React.Suspense>
				</div>
			</Layout>
		</>
	)
}

export default PoolByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

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

	return {
		props: {
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			poolAddress: validAddress,
			chainSymbol: chainDetails.nativeCurrency?.symbol ?? 'ETH'
		}
	}
}
