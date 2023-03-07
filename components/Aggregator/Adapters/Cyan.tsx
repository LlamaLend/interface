import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Tooltip from '~/components/Tooltip'
import type { ICyanQuote } from '~/types'
import BigNumber from 'bignumber.js'

// @ts-ignore
dayjs.extend(relativeTime)

export const CyanPools = ({ pools }: { pools: Array<ICyanQuote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-between gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] py-2 px-4">
				<div className="flex items-center gap-1">
					<svg width="30" height="30" viewBox="0 0 959 956" fill="none" xmlns="http://www.w3.org/2000/svg">
						<ellipse cx="479.5" cy="477.631" rx="479.5" ry="477.631" fill="#00FFFF" />
						<path
							d="M777.976 494.5C776.309 526.167 764.809 552.667 743.476 574C722.142 595.333 690.642 611.333 648.976 622C607.642 632.667 555.309 638 491.976 638C443.642 638 400.309 635.333 361.976 630C323.642 625 290.976 616.333 263.976 604C236.976 591.333 216.309 574.167 201.976 552.5C187.642 530.833 180.476 503.5 180.476 470.5C180.476 437.5 187.642 410 201.976 388C216.309 365.667 236.976 348 263.976 335C290.976 321.667 323.642 312.167 361.976 306.5C400.309 300.833 443.642 298 491.976 298C555.309 298 607.809 303.833 649.476 315.5C691.142 326.833 722.642 343.667 743.976 366C765.309 388.333 776.809 415.5 778.476 447.5H648.476C644.476 436.833 637.142 427.5 626.476 419.5C615.809 411.167 599.809 404.667 578.476 400C557.142 395.333 528.309 393 491.976 393C449.309 393 414.642 395.667 387.976 401C361.309 406 341.809 414.167 329.476 425.5C317.142 436.833 310.976 451.833 310.976 470.5C310.976 487.5 317.142 501.333 329.476 512C341.809 522.667 361.309 530.5 387.976 535.5C414.642 540.5 449.309 543 491.976 543C528.309 543 556.976 540.833 577.976 536.5C599.309 532.167 615.309 526.333 625.976 519C636.642 511.333 643.976 503.167 647.976 494.5H777.976Z"
							fill="black"
						/>
					</svg>
					<h1>Cyan</h1>
				</div>
				<a
					href={pools[0].url}
					target="_blank"
					rel="noreferrer noopener"
					className="absolute right-0 top-1 bottom-1 my-auto mx-4 flex flex-nowrap items-center justify-center gap-1 rounded-xl border border-[#252525] p-2 text-xs font-light"
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
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Borrowable
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Duration
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

const Pool = ({ pool }: { pool: ICyanQuote }) => {
	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">
				{`${Number(new BigNumber(pool.amount).div(10 ** 18).toString()).toLocaleString(undefined, {
					maximumFractionDigits: 2
				})} ${pool.currency}`}
			</td>

			<td className="border border-[#252525] p-2 text-center text-sm">
				{/* @ts-ignore */}
				{dayjs()
					.add(pool.term * pool.totalNumOfPayments, 'seconds')
					.toNow(true)}
			</td>

			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{(Number(pool.interestRateApr) / 100).toFixed(2)}%
			</td>
		</tr>
	)
}
