import Image from 'next/future/image'
import Tooltip from '~/components/Tooltip'
import { chainConfig } from '~/lib/constants'
import { useGetLoans } from '~/queries/useLoans'
import type { IBorrowPool } from '~/types'
import { formatLoanDeadline } from '~/utils'

interface ILenderPool {
	chainId?: number | null
	pool: IBorrowPool
}

export default function LenderPool({ chainId, pool }: ILenderPool) {
	const config = chainConfig(chainId)

	const { data, isLoading, isError } = useGetLoans({ chainId, poolAddress: pool.address })

	const chainSymbol = config.nativeCurrency?.symbol

	const weightedSum =
		data &&
		data.reduce((total, pool) => {
			return (total += pool.toPay.apr * pool.toPay.initialBorrowed)
		}, 0)

	const { poolBalance, totalBorrowed, totalDeposited } = pool

	const aprOnLentEth = totalBorrowed && weightedSum ? ((weightedSum / Number(totalBorrowed)) * 100).toFixed(2) : 0
	const aprOnAllEthDeposited =
		totalBorrowed && weightedSum ? ((weightedSum / Number(totalDeposited)) * 100).toFixed(2) : 0

	return (
		<div className="my-4 flex w-full flex-col gap-6 rounded-xl bg-[#191919] p-4 shadow">
			<div className="flex flex-col flex-wrap gap-4 lg:flex-row lg:gap-12">
				<div>
					<h1 className="text-xs font-light text-gray-400">Pool</h1>
					<a
						target="_blank"
						rel="noreferrer noopener"
						href={`${config.blockExplorer.url}/address/${pool.address}`}
						className="w-fit break-all text-base"
					>
						{`${pool.name} (${pool.symbol})`}
					</a>
				</div>

				<div>
					<h1 className="text-xs font-light text-gray-400">Total Deposited</h1>
					<p className="min-h-[1.5rem] break-all">
						{totalDeposited
							? `${
									Number(totalDeposited) / 1e18 < 1e-10 ? '~0' : (Number(totalDeposited) / 1e18).toFixed(4)
							  } ${chainSymbol}`
							: `0 ${chainSymbol}`}
					</p>
				</div>

				<div>
					<h1 className="text-xs font-light text-gray-400">Balance</h1>
					<p className="min-h-[1.5rem] break-all">
						{poolBalance
							? `${Number(poolBalance) / 1e18 < 1e-10 ? '~0' : (Number(poolBalance) / 1e18).toFixed(4)} ${chainSymbol}`
							: `0 ${chainSymbol}`}
					</p>
				</div>

				<div>
					<h1 className="text-xs font-light text-gray-400">Total Lent</h1>
					<p className="min-h-[1.5rem] break-all">
						{totalBorrowed ? (Number(totalBorrowed) / 1e18).toFixed(4) : 0} {chainSymbol}
					</p>
				</div>

				<div>
					<h1 className="text-xs font-light text-gray-400">% Borrowed</h1>
					<p className="min-h-[1.5rem] break-all">
						{totalBorrowed && totalDeposited ? ((Number(totalBorrowed) / Number(totalDeposited)) * 100).toFixed(2) : 0}{' '}
						%
					</p>
				</div>
				<div>
					<h1 className="text-xs font-light text-gray-400">APR on lent {chainSymbol}</h1>
					<p className="min-h-[1.5rem] break-all">{aprOnLentEth}%</p>
				</div>
				<div>
					<h1 className="text-xs font-light text-gray-400">APR on all {chainSymbol} deposited</h1>
					<p className="min-h-[1.5rem] break-all">{aprOnAllEthDeposited}%</p>
				</div>
			</div>

			<div className="space-y-1">
				<h1 className="text-xs font-light text-gray-400">Active Loans</h1>
				<div className="relative mx-auto mb-auto w-full overflow-x-auto rounded-xl">
					<table className="mx-auto w-full table-auto border-collapse rounded-xl bg-[#010101] text-base">
						<thead className="bg-[#111111]">
							<tr>
								<th className="rounded-tl-xl border border-[#252525] p-4 font-normal text-[#989898]" rowSpan={2}>
									Token Id
								</th>
								<th className="border border-[#252525] p-4 font-normal text-[#989898]" rowSpan={2}>
									User
								</th>
								<th className="border border-[#252525] p-4 py-1 text-center font-normal text-[#989898]" colSpan={5}>
									To Pay
								</th>
								<th className="border border-[#252525] p-4 font-normal text-[#989898]" rowSpan={2}>
									Deadline
								</th>
							</tr>
							<tr>
								<th className="whitespace-nowrap border border-[#252525] px-2 py-1 text-center font-normal text-[#989898]">
									Initial Borrowed
								</th>
								<th className="whitespace-nowrap border border-[#252525] px-2 py-1 text-center font-normal text-[#989898]">
									APR
								</th>
								<th className="whitespace-nowrap border border-[#252525] px-2 py-1 text-center font-normal text-[#989898]">
									Interest Accrued
								</th>
								<th className="whitespace-nowrap border border-[#252525] px-2 py-1 text-center font-normal text-[#989898]">
									Late Fees
								</th>
								<th className="whitespace-nowrap border border-[#252525] px-2 py-1 text-center font-normal text-[#989898]">
									Total
								</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<>
									{new Array(5).fill('x').map((_, index) => (
										<tr key={'pl' + index}>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<span className="flex items-center gap-4">
													<div className="relative aspect-square h-10 rounded bg-[#111111]"></div>
													<div className="placeholder-box h-5 w-[93px]"></div>
												</span>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box h-5 w-[90px]"></div>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box mx-auto h-5 w-[90px]"></div>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box mx-auto h-5 w-[90px]"></div>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box mx-auto h-5 w-[90px]"></div>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box mx-auto h-5 w-[90px]"></div>
											</td>
											<td className="border border-[#252525] px-4 py-2 text-center">
												<div className="placeholder-box mx-auto h-5 w-[72px]"></div>
											</td>
										</tr>
									))}
								</>
							) : isError || data?.length === 0 ? (
								<tr>
									<td className="border border-[#252525] px-4 py-2 text-center" colSpan={8}>
										{isError ? "Something went wrong, couldn't fetch pools" : 'No Active Loans'}
									</td>
								</tr>
							) : (
								<>
									{data.map((loan) => (
										<tr key={loan.id}>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
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
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												<a
													target="_blank"
													rel="noreferrer noopener"
													href={`${config.blockExplorer.url}/address/${loan.owner}`}
													className="underline"
												>
													{loan.owner.slice(0, 4) + '...' + loan.owner.slice(-4)}
												</a>
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												{(loan.toPay.initialBorrowed / 1e18).toFixed(4) + ' ' + chainSymbol}
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												{(loan.toPay.apr * 100).toFixed(2) + ' %'}
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												{(loan.toPay.interestAccrued / 1e18).toFixed(4) + ' ' + chainSymbol}
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												{(loan.toPay.lateFees / 1e18).toFixed(4) + ' ' + chainSymbol}
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												{(loan.toPay.total / 1e18).toFixed(4) + ' ' + chainSymbol}
											</td>
											<td className="whitespace-nowrap border border-[#252525] px-4 py-2 text-center">
												<Tooltip content={new Date(loan.deadline).toUTCString()}>
													<span className="w-full text-center">{formatLoanDeadline(loan.deadline)}</span>
												</Tooltip>
											</td>
										</tr>
									))}
								</>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
