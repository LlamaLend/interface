import { useToken } from 'wagmi'
import Tooltip from '~/components/Tooltip'
import type { IParaSpaceQuote } from '~/types'
import BigNumber from 'bignumber.js'

export const ParaSpacePools = ({ pools }: { pools: Array<IParaSpaceQuote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-between gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] py-2 px-4">
				<div className="flex items-center gap-1">
					<img src="/assets/paraspace.png" alt="" className="relative -top-[2px] h-5" />
					<h1>ParaSpace</h1>
					<Tooltip content="Price based liquidations">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
							<path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
							<path
								fillRule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
								clipRule="evenodd"
							/>
						</svg>
					</Tooltip>
				</div>
				<a
					href={pools[0].loanUrl}
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
								Borrowable Per NFT
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

const Pool = ({ pool }: { pool: IParaSpaceQuote }) => {
	const { data } = useToken({ address: pool.borrowableToken, chainId: 1 })

	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">
				{data &&
					`${Number(new BigNumber(pool.availableBorrow).div(10 ** data.decimals).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ${data.symbol}`}
			</td>
			<td className="border border-[#252525] p-2 text-center text-sm">
				{`${(Number(pool.borrowableTokenVariableBorrowRate) / 1e25).toFixed(2)}%`}
			</td>
		</tr>
	)
}
