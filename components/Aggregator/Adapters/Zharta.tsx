import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import { useToken } from 'wagmi'
import Tooltip from '~/components/Tooltip'
import type { IZhartaQuote } from '~/types'
import BigNumber from 'bignumber.js'

// @ts-ignore
dayjs.extend(relativeTime)

export const ZhartaPools = ({ pools }: { pools: Array<IZhartaQuote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-between gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] py-2 px-4">
				<div className="flex items-center gap-1">
					<img src="/assets/zharta.png" alt="" className="relative -top-[2px] h-5" />
					<h1>Zharta</h1>
					<Tooltip content="Pro-rata Interest">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
							<path
								fillRule="evenodd"
								d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 001.029.696l3.471-1.388 3.472 1.388a.75.75 0 00.556 0l3.472-1.388 3.471 1.388a.75.75 0 001.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0012 1.5zm3.53 7.28a.75.75 0 00-1.06-1.06l-6 6a.75.75 0 101.06 1.06l6-6zM8.625 9a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm5.625 3.375a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
					<Tooltip content="Pay for time borrowed">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
							<path
								fillRule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
				</div>
				<a
					href={pools[0].url}
					target="_blank"
					rel="noreferrer noopener"
					className="absolute right-0 top-1 bottom-1 my-auto mx-4 flex flex-nowrap items-center justify-center gap-1 rounded-xl border border-[#252525] p-2 text-xs"
				>
					<Tooltip content="View Vaults">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
							<path
								fillRule="evenodd"
								d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
				</a>
			</div>
			<div className="overflow-x-auto rounded-b-xl">
				<table className="w-full min-w-[43.75rem] table-fixed border-collapse rounded-xl bg-[#010101]">
					<thead className="h-[2.625rem] bg-[#111111]">
						<tr>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Min Borrowable Per NFT
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Max Borrowable Per NFT
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Duration
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								LTV
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								APR
							</th>
						</tr>
					</thead>
					<tbody>
						{pools.map((pool, index) => (
							<Pool key={Object.values(pool).join('') + index} pool={pool} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

const Pool = ({ pool }: { pool: IZhartaQuote }) => {
	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">
				{`${Number(new BigNumber(pool.minBorrowableAmount).div(10 ** 18).toString()).toLocaleString(undefined, {
					maximumFractionDigits: 2
				})} ETH`}
			</td>
			<td className="border border-[#252525] p-2 text-center text-sm">
				{`${Number(new BigNumber(pool.maxBorrowableAmount).div(10 ** 18).toString()).toLocaleString(undefined, {
					maximumFractionDigits: 2
				})} ETH`}
			</td>
			<td className="border border-[#252525] p-2 text-center text-sm">
				{/* @ts-ignore */}
				{dayjs().add(pool.duration, 'seconds').toNow(true)}
			</td>
			<td className="border border-[#252525] p-2 text-center text-sm">{`${Number(pool.ltv)}%`}</td>
			<td className="border border-[#252525] p-2 text-center text-sm">
				{`${(Number(pool.interestRateApr) * 100).toFixed(0)}%`}
			</td>
		</tr>
	)
}
