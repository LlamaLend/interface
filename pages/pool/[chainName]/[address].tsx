import type { GetServerSideProps, NextPage } from 'next'
import { allChains } from 'wagmi'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Layout from '~/components/Layout'
import { useGetPoolData } from '~/queries/useGetPoolData'
import { chainConfig, SECONDS_IN_A_YEAR } from '~/lib/constants'
import Head from 'next/head'
import { cx } from 'cva'

// @ts-ignore
dayjs.extend(relativeTime)

interface IPageProps {
	chainId?: number
	chainName?: string
	address?: string
}

const PoolByChain: NextPage<IPageProps> = ({ chainId, address }) => {
	const { data, isLoading, isError } = useGetPoolData({ chainId, address })
	const config = chainConfig(chainId)

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout className="relative">
				<div className="px-3 py-6 h-fit bg-[#111111] rounded-xl shadow">
					<div className="rounded-full mx-auto h-24 w-24 bg-gradient-to-r from-[#141e30] to-[#243b55]"></div>

					<h1></h1>

					<a
						className={cx(
							'text-sm bg-[#202020] rounded mx-auto mt-4 mb-10 block break-all min-h-[1.75rem]',
							isLoading ? 'placeholder-box w-full max-w-[22rem]' : 'p-1 w-fit'
						)}
						target="_blank"
						rel="noreferrer noopener"
						href={`${config.blockExplorer.url}/address/${data?.nftContract}`}
					>
						{data?.nftContract ?? ''}
					</a>

					<h2
						className={cx(
							'text-center text-2xl font-medium my-4 min-h-[2rem]',
							isLoading ? 'mx-auto placeholder-box w-full max-w-[300px]' : ''
						)}
					>
						{data?.name ?? ''}
					</h2>

					<div className="flex flex-col items-center justify-center gap-10 md:flex-row">
						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020]">
							<h3 className="text-center font-medium">Current Annual Interest</h3>
							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{isError ? '-' : data ? `${(data.currentAnnualInterest / 1e16).toFixed(2)}% p.a.` : ''}
							</p>
						</div>
						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020]">
							<h3 className="text-center font-medium">Maximum Annual Interest</h3>

							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{isError
									? '-'
									: data
									? `${(data.maxInterestPerEthPerSecond / (10 * SECONDS_IN_A_YEAR)).toFixed(2)}% p.a.`
									: ''}
							</p>
						</div>
						<div className="flex flex-col gap-4 items-center px-8 py-4 rounded-xl bg-[#202020]">
							<h3 className="text-center font-medium">Maximum Loan Duration</h3>

							<p
								className={cx(
									'text-[#F6F6F6] font-mono min-h-[1.5rem]',
									isLoading ? 'placeholder-box w-full max-w-[100px]' : ''
								)}
							>
								{isError
									? '-'
									: data
									? // @ts-ignore
									  `${dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}`
									: ''}
							</p>
						</div>
					</div>
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
		props: { chainId: chainDetails.id, chainName: chainDetails.name, address: validAddress }
	}
}
