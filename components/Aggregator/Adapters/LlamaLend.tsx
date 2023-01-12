import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Tooltip from '~/components/Tooltip'
import type { ILlamaLendQuote } from '~/types'
import Image from 'next/image'
import { formatCurrentAnnualInterest, formatDailyInterest } from '~/utils'

// @ts-ignore
dayjs.extend(relativeTime)

export const LlamalendPools = ({ pools }: { pools: Array<ILlamaLendQuote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-center gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] p-2">
				<Image src="/assets/gib.png" alt="" className="block" height={20} width={20} />
				<h1>LlamaLend</h1>

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
							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">Principal</th>

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
