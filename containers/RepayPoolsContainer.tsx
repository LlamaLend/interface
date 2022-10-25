import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/future/image'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import { useGetLoans } from '~/queries/useLoans'
import { formatLoanDeadline } from '~/utils'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import { RepayCart } from '~/components/Cart'

interface ILoansContainerProps {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function LoanPoolsContainer({ chainId, chainName, userAddress }: ILoansContainerProps) {
	const { isConnected, address } = useAccount()

	const { openConnectModal } = useConnectModal()

	const config = chainConfig(chainId)

	const { data, isLoading, isError } = useGetLoans({ chainId, userAddress })

	const chainSymbol = chainConfig(chainId).nativeCurrency?.symbol

	// query to get cart items from local storage
	// dont pass user address to this query, as we only to get items in cart of connected wallet's userAddress
	const { data: itemsInCart } = useGetCartItems({ contractAddress: 'repay', chainId })

	// query to save items to cart
	const { mutate: addToCart } = useSaveItemToCart({ chainId })

	return (
		<>
			<Head>
				<title>Repay - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : !userAddress ? (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect</button> your wallet to view loans.
					</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get loans.</p>
				) : data?.length === 0 ? (
					<p className="fallback-text">
						You don't have any loans, Click{' '}
						<Link href="/">
							<a className="underline">here</a>
						</Link>{' '}
						to borrow {chainSymbol}.
					</p>
				) : (
					<div className="relative mx-auto mt-8 mb-auto w-full overflow-x-auto sm:my-9">
						<table className="mx-auto w-full table-auto border-collapse rounded-xl bg-[#010101] text-base">
							<thead className="bg-[#111111]">
								<tr>
									<th className="rounded-tl-xl p-4 pl-[4.5rem] text-left font-normal text-[#989898]">Token Id</th>
									<th className="p-4 text-left font-normal text-[#989898]">Pool</th>
									<th className="p-4 text-left font-normal text-[#989898]">To Pay</th>
									<th className="p-4 text-left font-normal text-[#989898]">Deadline</th>
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
													<div className="placeholder-box h-5 w-[72px]"></div>
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
															href={`${config.blockExplorer.url}/token/${loan.pool.address}?a=${loan.id}`}
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
													{(loan.toPay / 1e18).toFixed(4) + ' ' + chainSymbol}
												</td>
												<td className="whitespace-nowrap px-4 py-2">{formatLoanDeadline(loan.deadline)}</td>
												<td className="whitespace-nowrap px-4 py-2">
													{itemsInCart?.includes(loan.id) ? (
														<button
															className="ml-auto flex h-4 min-w-[10rem] items-center justify-center gap-1 rounded-lg border border-[#243b55] p-4 text-sm text-white"
															onClick={() => addToCart({ contractAddress: 'repay', tokenId: loan.id })}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth={2}
															>
																<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
															</svg>
															<span>Added to cart</span>
														</button>
													) : (
														<button
															className="ml-auto flex h-4 min-w-[10rem] items-center justify-center gap-1 rounded-lg border border-[#243b55] bg-[#243b55] p-4 text-sm text-white disabled:cursor-not-allowed disabled:text-opacity-50"
															onClick={() => addToCart({ contractAddress: 'repay', tokenId: loan.id })}
															disabled={!isConnected || address?.toLowerCase() !== userAddress?.toLowerCase()}
														>
															Add to cart
														</button>
													)}
												</td>
											</tr>
										))}
									</>
								)}
							</tbody>
						</table>
					</div>
				)}

				<RepayCart chainId={chainId} userAddress={userAddress} isLoading={isLoading} />
			</Layout>
		</>
	)
}
