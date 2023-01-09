import { useToken } from 'wagmi'
import Tooltip from '~/components/Tooltip'
import type { IBendDaoQuote } from '~/types'
import BigNumber from 'bignumber.js'

export const BenDaoPools = ({ pools }: { pools: Array<IBendDaoQuote> }) => {
	return (
		<div>
			<div className="relative flex h-[2.625rem] items-center justify-center gap-2 border border-b-0 border-[#252525] py-2 px-4">
				<img src="/assets/bendao.png" alt="" className="h-5" />
				<h1 className="font-light">BenDAO</h1>

				<a
					href={pools[0].loanUrl}
					target="_blank"
					rel="noreferrer noopener"
					className="absolute right-0 top-1 bottom-1 my-auto mx-6 flex flex-nowrap items-center justify-center gap-1 rounded-xl bg-[#243b55] p-2 text-xs font-light"
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
			<div className="overflow-x-auto">
				<table className="w-full min-w-[43.75rem] table-fixed border-collapse border border-[#252525]">
					<thead>
						<tr>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Token
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Floor
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Available to Borrow
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								LTV
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Liquidation Threshold
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

const Pool = ({ pool }: { pool: IBendDaoQuote }) => {
	const { data } = useToken({ address: pool.borrowableToken, chainId: 1 })

	return (
		<tr>
			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light underline">
				{data && (
					<a href={`https://etherscan.io/address/${data.address}`} target="_blank" rel="noreferrer noopener">
						{`${data.symbol}`}
					</a>
				)}
			</td>
			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{data &&
					`${Number(new BigNumber(pool.floorInEth).div(10 ** 18).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ETH`}
			</td>
			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{data &&
					`${Number(new BigNumber(pool.availableBorrow).div(10 ** data.decimals).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ${data.symbol}`}
			</td>
			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">{pool.ltv}</td>
			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{pool.liquidationThreshold}
			</td>
		</tr>
	)
}
