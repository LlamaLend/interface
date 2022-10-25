import Head from 'next/head'
import Image from 'next/future/image'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import { useGetLoansToLiquidate } from '~/queries/useLoans'
import BeatLoader from '~/components/BeatLoader'
import { useLiquidateLoan } from '~/queries/admin/useLiquidateLoan'
import type { ILoan } from '~/types'

interface ILiquidateContainerProps {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function LiquidateContainer({ chainId, chainName, userAddress }: ILiquidateContainerProps) {
	const { openConnectModal } = useConnectModal()

	const config = chainConfig(chainId)

	const { data, isLoading, isError } = useGetLoansToLiquidate({ chainId, liquidatorAddress: userAddress })

	return (
		<>
			<Head>
				<title>Liquidate - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : !userAddress ? (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect</button> your wallet to view loans to liquidate.
					</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get loans to liquidate.</p>
				) : data?.length === 0 ? (
					<p className="fallback-text">You don't have any loans to liquidate.</p>
				) : (
					<>
						<h1 className="mt-8 -mb-8 text-2xl">Loans to Liquidate</h1>
						<div className="relative mx-auto mt-8 mb-auto w-full overflow-x-auto sm:my-9">
							<table className="mx-auto w-full table-auto border-collapse rounded-xl bg-[#010101] text-base">
								<thead className="bg-[#111111]">
									<tr>
										<th className="rounded-tl-xl p-4 pl-[4.5rem] text-left font-normal text-[#989898]">Token Id</th>
										<th className="p-4 text-left font-normal text-[#989898]">Pool</th>
										<th className="p-4 text-left font-normal text-[#989898]">User</th>
										<th className="rounded-tr-xl p-4 text-left font-normal text-[#989898]"></th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<>
											{new Array(5).fill('x').map((_, index) => (
												<tr key={'pl' + index}>
													<td className="px-4 py-2">
														<span className="flex items-center gap-4">
															<div className="relative aspect-square h-10 rounded bg-[#111111]"></div>
															<div className="placeholder-box h-5 w-[93px]"></div>
														</span>
													</td>
													<td className="px-4 py-2">
														<div className="placeholder-box h-5 w-[197px]"></div>
													</td>
													<td className="px-4 py-2">
														<div className="placeholder-box h-5 w-[90px]"></div>
													</td>
													<td className="px-4 py-2">
														<div className="ml-auto h-[34px] w-[10rem] rounded-lg border border-[#243b55] bg-[#243b55]"></div>
													</td>
												</tr>
											))}
										</>
									) : (
										<>
											{data.map((loan) => (
												<tr key={loan.id}>
													<td className="whitespace-nowrap px-4 py-2">
														<span className="flex items-center gap-4">
															<div className="relative aspect-square h-10 rounded bg-[#111111]">
																{loan.imgUrl !== '' && (
																	<Image src={loan.imgUrl} fill alt="" className="aspect-square rounded" />
																)}
															</div>

															<a
																target="_blank"
																rel="noreferrer noopener"
																href={`${config.blockExplorer.url}/token/${loan.pool.address}?a=${loan.loanId}`}
																className="underline"
															>
																{loan.id.slice(0, 4) + '...' + loan.id.slice(-4)}
															</a>
														</span>
													</td>
													<td className="whitespace-nowrap px-4 py-2">
														<a
															target="_blank"
															rel="noreferrer noopener"
															href={`${config.blockExplorer.url}/address/${loan.pool.address}`}
															className="underline"
														>
															{loan.pool.name}
														</a>
														<span>{` by `}</span>
														<a
															target="_blank"
															rel="noreferrer noopener"
															href={`${config.blockExplorer.url}/address/${loan.pool.owner}`}
															className="underline"
														>
															{loan.pool.owner.slice(0, 4) + '...' + loan.pool.owner.slice(-4)}
														</a>
													</td>
													<td className="whitespace-nowrap px-4 py-2">
														<a
															target="_blank"
															rel="noreferrer noopener"
															href={`${config.blockExplorer.url}/address/${loan.owner}`}
															className="underline"
														>
															{loan.owner.slice(0, 4) + '...' + loan.owner.slice(-4)}
														</a>
													</td>

													<td className="whitespace-nowrap px-4 py-2">
														<LiquidateLoan chainId={chainId} liquidatorAddress={userAddress} data={loan} />
													</td>
												</tr>
											))}
										</>
									)}
								</tbody>
							</table>
						</div>
					</>
				)}
			</Layout>
		</>
	)
}

interface ILiquidateLoan {
	liquidatorAddress: string
	chainId: number
	data: ILoan
}

const LiquidateLoan = ({ liquidatorAddress, chainId, data }: ILiquidateLoan) => {
	const { isConnected, address } = useAccount()

	const {
		write: liquidate,
		isLoading: approvingLiquidation,
		waitForTransaction: { isLoading: confirmingLiquidation }
	} = useLiquidateLoan({
		liquidatorAddress,
		poolAddress: data.pool.address,
		chainId,
		loanToLiquidate: { nft: data.nftId, interest: data.interest, startTime: data.startTime, borrowed: data.borrowed }
	})

	return (
		<button
			className="ml-auto flex h-4 min-w-[10rem] items-center justify-center gap-1 rounded-lg border border-[#243b55] bg-[#243b55] p-4 text-sm text-white disabled:cursor-not-allowed disabled:text-opacity-50"
			onClick={() => liquidate?.()}
			disabled={
				!isConnected ||
				address?.toLowerCase() !== liquidatorAddress?.toLowerCase() ||
				!liquidate ||
				approvingLiquidation ||
				confirmingLiquidation
			}
		>
			{approvingLiquidation || confirmingLiquidation ? <BeatLoader /> : 'Liquidate'}
		</button>
	)
}
