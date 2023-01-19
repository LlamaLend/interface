import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Tooltip from '~/components/Tooltip'
import type { ILlamaLendQuote } from '~/types'
import Image from 'next/image'
import { formatCurrentAnnualInterest } from '~/utils'

// @ts-ignore
dayjs.extend(relativeTime)

export const LlamalendPools = ({ pools }: { pools: Array<ILlamaLendQuote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-center gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] p-2">
				<div className="flex gap-1">
					<Image src="/assets/gib.png" alt="" className="block" height={20} width={20} />
					<h1>LlamaLend</h1>
					<Tooltip content="Pay for time borrowed">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
							<path
								fillRule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
					<Tooltip content="Fixed Interest">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
							<path
								fillRule="evenodd"
								d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 001.029.696l3.471-1.388 3.472 1.388a.75.75 0 00.556 0l3.472-1.388 3.471 1.388a.75.75 0 001.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0012 1.5zm3.53 7.28a.75.75 0 00-1.06-1.06l-6 6a.75.75 0 101.06 1.06l6-6zM8.625 9a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm5.625 3.375a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
				</div>
				<a
					href={pools[0].url}
					target="_blank"
					rel="noreferrer noopener"
					className="absolute right-0 top-1 bottom-1 my-auto mx-6 flex flex-nowrap items-center justify-center gap-1 rounded-xl border border-[#252525] p-2 text-xs"
				>
					<Tooltip content="View Collection">
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
							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">Borrowable</th>

							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">Max Duration</th>

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

const Pool = ({ pool }: { pool: ILlamaLendQuote }) => {
	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">{`${pool.pricePerNft} ETH`}</td>

			<td className="border border-[#252525] p-2 text-center text-sm">
				{/* @ts-ignore */}
				{dayjs(new Date(new Date().getTime() + pool.maxLoanLength * 1000)).toNow(true)}
			</td>

			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{`${formatCurrentAnnualInterest(pool.currentAnnualInterest)}%`}
			</td>
		</tr>
	)
}
