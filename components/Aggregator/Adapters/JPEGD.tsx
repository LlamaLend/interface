import { useToken } from 'wagmi'
import Tooltip from '~/components/Tooltip'
import type { IJpegdQuote } from '~/types'
import BigNumber from 'bignumber.js'

export const JPEGDPools = ({ pools }: { pools: Array<IJpegdQuote> }) => {
	const pUsdPerPeth = Number(pools[1].credit) / Number(pools[0].credit)
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-center gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] p-2">
				<img
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAcCAYAAACAsYoxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK7SURBVHgB7ZlBjtowFEB/SFiTI3ikILGcHgApucFUHKBwgla9APQE055g6AXKdMO2HoG6ni67wt12uoBuuiAD/Y6cSQqOsTOhQ0Z+0leM43zifP3v/20Ai8VisRzAActJM5vNQrxwgTiO30dRtORtDyynTug4zpA3Wq3WFV4SwzXAUkus4WqKNVxNMVrjttvtOV583sa4S0Uf/32uqWKJz92q9Bpyi/qWO7pM3qdoHgz7GRgi+z7HwjQ5maAQFIZyJvouUK40n6cokaT/EkTmZAgBsVjn4B/vC+jBQD6PAcoYzMnP46gZuw2VNaXqcuAa5ZtqAIaTkWjSgnDyAfa9qIiVRC/nHeih+z8nR9WG+4zGGBfdxI8bwr9hjEqGXaKOH2DOMNWJz0fwzLGhsqZU7XGv0ateKe4zyJITVjBmjDp2+27Qi0ZgCOrp40X1PjzLfSnaNPdussyXZ4sTiY6PqihzLKo23KE0nGqkyaGkj0E5CKizVZY2RPrPFGP9Al038ATYUFlTqva4QQVhg5RMTvYQ4XW027+VxOIicOgCRO2K+hzJ/ZGJvhLQVP0KSTvt6cCJ0+12KUiyb2u4x8Mg+7Blt+6MsYZ7JGJp4MLDJq9Rw6KxQRBMxH5mKTabTbhYLJJlxBru/+KjoQlUgJfbKmJPUY88dwghvud5iZe1223fdV39h1d3AL9/Pfz8s2m8cIPgjJ+IcI972CqCcjviFgXNZvMCnSM5dej1etDpdLSfdb5+Qslq/rffG8kP1EdtHVdTuMel2zxELK4q+K47g+Puqo8NyqJ+ruYzmUc6Vmceg7ShoXcv8Viv1xS9LtExnU6H8/mcgCbOT5zaXeZbntt448SwwiRl6eVOgEM4fJjZr6o4VhBCCUzmYXJ6kNNLoMS7MQSyrJPvmxIwIqv57+/j6zSrtKGypvwF8vr1hFBo7g4AAAAASUVORK5CYII="
					alt=""
					className="h-5"
				/>

				<a
					href={pools[0].loanUrl}
					target="_blank"
					rel="noreferrer noopener"
					className="absolute right-0 top-1 bottom-1 my-auto mx-6 flex flex-nowrap items-center justify-center gap-1 rounded-xl border border-[#252525] p-2 text-xs"
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
								Floor
							</th>
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Min. Credit
							</th>
							{/* <th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Liquidation Limit
							</th> */}
							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								APR
							</th>
						</tr>
					</thead>
					<tbody>
						{pools.map((pool, index) => (
							<Pool key={Object.values(pool).join('') + index} pool={pool} pUsdPerPeth={pUsdPerPeth} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

const Pool = ({ pool, pUsdPerPeth }: { pool: IJpegdQuote; pUsdPerPeth: number }) => {
	const { data } = useToken({ address: pool.pToken, chainId: 1 })

	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">
				{/* {data &&
					`${Number(new BigNumber(pool.floorInEth).div(10 ** 18).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ETH`} */}
				{data && pool.vaultName === 'pETH Vault'
					? `${(Number(pool.floorInEth) / 1e18).toFixed(2)} pETH`
					: `${((Number(pool.floorInEth) / 1e18) * pUsdPerPeth).toFixed(2)} pUSd`}
			</td>
			<td className="border border-[#252525] p-2 text-center text-sm">
				{data &&
					`${Number(new BigNumber(pool.credit).div(10 ** data.decimals).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ${data.symbol}`}
			</td>
			{/* <td className="border border-[#252525] p-2 text-center text-sm">
				{data &&
					`${Number(new BigNumber(pool.liquidationLimit).div(10 ** data.decimals).toString()).toLocaleString(
						undefined,
						{
							maximumFractionDigits: 2
						}
					)} ${data.symbol}`}
			</td> */}
			<td className="border border-[#252525] p-2 text-center text-sm">
				{pool.vaultName === 'pETH Vault' ? `5%` : `2%`}
			</td>
		</tr>
	)
}
