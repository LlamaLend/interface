import { useToken } from 'wagmi'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import Tooltip from '~/components/Tooltip'
import type { IX2Y2Quote } from '~/types'
import BigNumber from 'bignumber.js'

// @ts-ignore
dayjs.extend(relativeTime)

export const X2Y2Pools = ({ pools }: { pools: Array<IX2Y2Quote> }) => {
	return (
		<div>
			<div className="relative flex min-h-[2.625rem] items-center justify-center gap-2 rounded-t-xl border border-b-0 border-[#252525] bg-[#111111] p-2">
				<svg viewBox="0 0 134 40" height="20px" focusable="false" className="chakra-icon css-1oovn9z">
					<path
						d="M52 30L56.0652 20.2266L52 10.17H57.085L60.2011 18.5127H60.6261L63.7989 10.17H68.8839L64.7762 20.2266L68.8839 30H63.7989L60.6261 21.8839H60.2153L57.085 30H52Z"
						fill="currentColor"
					></path>
					<path
						d="M72.318 30V26.6714C72.6012 26.4636 72.979 26.1804 73.4511 25.8215C73.9232 25.4627 74.452 25.0472 75.0375 24.5751C75.623 24.0935 76.2226 23.5788 76.8364 23.0312C77.4596 22.4835 78.0592 21.9122 78.6352 21.3173C79.2207 20.7129 79.7448 20.118 80.2075 19.5326C80.6702 18.9377 81.0385 18.3569 81.3123 17.7904C81.5861 17.2238 81.7231 16.695 81.7231 16.204C81.7231 15.7318 81.6664 15.3258 81.5531 14.9858C81.4398 14.6459 81.2745 14.372 81.0573 14.1643C80.8496 13.9471 80.5994 13.7866 80.3066 13.6827C80.0233 13.5788 79.7023 13.5269 79.3435 13.5269C78.7769 13.5269 78.2764 13.6969 77.842 14.0368C77.4171 14.3768 77.063 14.797 76.7797 15.2974C76.5059 15.7885 76.3123 16.2748 76.199 16.7564L72.1763 15.0283C72.4313 13.9896 72.9081 13.0925 73.6069 12.3371C74.3057 11.5817 75.1508 11.0057 76.1423 10.6091C77.1433 10.203 78.215 10 79.3576 10C80.3774 10 81.3217 10.1086 82.1905 10.3258C83.0592 10.5335 83.8147 10.8782 84.4568 11.3598C85.1083 11.8319 85.6135 12.4599 85.9724 13.2436C86.3406 14.0274 86.5248 15 86.5248 16.1615C86.5248 16.8791 86.3548 17.6204 86.0148 18.3853C85.6749 19.1407 85.2264 19.8914 84.6692 20.6374C84.1215 21.3739 83.5267 22.0774 82.8845 22.7479C82.2519 23.4089 81.6286 24.0132 81.0148 24.5609C80.4011 25.0992 79.8581 25.5477 79.3859 25.9065C78.9232 26.2559 78.5975 26.492 78.4086 26.6147H86.284V30H72.318Z"
						fill="currentColor"
					></path>
					<path
						d="M96.8286 30V23.6119L90.9787 10.17H95.7804L99.1515 19.3343L102.523 10.17H107.324L101.503 23.6119V30H96.8286Z"
						fill="currentColor"
					></path>
					<path
						d="M111.056 30V26.6714C111.339 26.4636 111.717 26.1804 112.189 25.8215C112.661 25.4627 113.19 25.0472 113.775 24.5751C114.361 24.0935 114.96 23.5788 115.574 23.0312C116.198 22.4835 116.797 21.9122 117.373 21.3173C117.959 20.7129 118.483 20.118 118.945 19.5326C119.408 18.9377 119.776 18.3569 120.05 17.7904C120.324 17.2238 120.461 16.695 120.461 16.204C120.461 15.7318 120.404 15.3258 120.291 14.9858C120.178 14.6459 120.012 14.372 119.795 14.1643C119.587 13.9471 119.337 13.7866 119.045 13.6827C118.761 13.5788 118.44 13.5269 118.081 13.5269C117.515 13.5269 117.014 13.6969 116.58 14.0368C116.155 14.3768 115.801 14.797 115.518 15.2974C115.244 15.7885 115.05 16.2748 114.937 16.7564L110.914 15.0283C111.169 13.9896 111.646 13.0925 112.345 12.3371C113.044 11.5817 113.889 11.0057 114.88 10.6091C115.881 10.203 116.953 10 118.096 10C119.115 10 120.06 10.1086 120.928 10.3258C121.797 10.5335 122.553 10.8782 123.195 11.3598C123.846 11.8319 124.351 12.4599 124.71 13.2436C125.079 14.0274 125.263 15 125.263 16.1615C125.263 16.8791 125.093 17.6204 124.753 18.3853C124.413 19.1407 123.964 19.8914 123.407 20.6374C122.859 21.3739 122.265 22.0774 121.622 22.7479C120.99 23.4089 120.367 24.0132 119.753 24.5609C119.139 25.0992 118.596 25.5477 118.124 25.9065C117.661 26.2559 117.335 26.492 117.147 26.6147H125.022V30H111.056Z"
						fill="currentColor"
					></path>
					<path
						d="M40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20Z"
						fill="white"
					></path>
					<path
						d="M32.7041 10.2721C30.2524 7.87643 26.8986 6.4 23.2 6.4C15.6889 6.4 9.6 12.4889 9.6 20C9.6 27.5111 15.6889 33.6 23.2 33.6C26.8986 33.6 30.2524 32.1236 32.7041 29.7279C29.7796 33.5413 25.1769 36 20 36C11.1634 36 4 28.8366 4 20C4 11.1634 11.1634 4 20 4C25.1769 4 29.7796 6.45869 32.7041 10.2721Z"
						fill="url(#paint0_linear_13610_53694)"
					></path>
					<path
						d="M13.0366 27.7824C14.998 29.6989 17.681 30.88 20.6399 30.88C26.6488 30.88 31.5199 26.0089 31.5199 20C31.5199 13.9911 26.6488 9.12001 20.6399 9.12001C17.681 9.12001 14.998 10.3011 13.0366 12.2176C15.3762 9.16696 19.0583 7.20001 23.1999 7.20001C30.2691 7.20001 35.9999 12.9308 35.9999 20C35.9999 27.0692 30.2691 32.8 23.1999 32.8C19.0583 32.8 15.3762 30.833 13.0366 27.7824Z"
						fill="url(#paint1_linear_13610_53694)"
					></path>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M29.5999 20C29.5999 25.3019 25.3018 29.6 19.9999 29.6C14.698 29.6 10.3999 25.3019 10.3999 20C10.3999 14.6981 14.698 10.4 19.9999 10.4C25.3018 10.4 29.5999 14.6981 29.5999 20ZM26.3999 20C26.3999 23.5346 23.5345 26.4 19.9999 26.4C16.4653 26.4 13.5999 23.5346 13.5999 20C13.5999 16.4654 16.4653 13.6 19.9999 13.6C23.5345 13.6 26.3999 16.4654 26.3999 20Z"
						fill="url(#paint2_linear_13610_53694)"
					></path>
					<defs>
						<linearGradient
							id="paint0_linear_13610_53694"
							x1="4"
							y1="19.4483"
							x2="36"
							y2="19.4483"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#00E0FF"></stop>
							<stop offset="1" stopColor="#562EC8"></stop>
						</linearGradient>
						<linearGradient
							id="paint1_linear_13610_53694"
							x1="3.99992"
							y1="19.4483"
							x2="35.9999"
							y2="19.4483"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#00E0FF"></stop>
							<stop offset="1" stopColor="#562EC8"></stop>
						</linearGradient>
						<linearGradient
							id="paint2_linear_13610_53694"
							x1="3.9999"
							y1="19.4483"
							x2="35.9999"
							y2="19.4483"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#00E0FF"></stop>
							<stop offset="1" stopColor="#562EC8"></stop>
						</linearGradient>
					</defs>
				</svg>

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

							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">Duration</th>

							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">PayOff</th>

							<th className="h-[2.625rem] border border-[#252525] p-2 text-sm font-light text-white text-opacity-50">
								Interest
							</th>

							<th className="border border-[#252525] p-2 text-sm font-normal text-[#989898]">Expiry</th>
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

const Pool = ({ pool }: { pool: IX2Y2Quote }) => {
	const { data } = useToken({ address: pool.token, chainId: 1 })

	return (
		<tr className="h-[2.625rem]">
			<td className="border border-[#252525] p-2 text-center text-sm">
				{data &&
					`${Number(new BigNumber(pool.amount).div(10 ** data.decimals).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ${data.symbol}`}
			</td>

			<td className="border border-[#252525] p-2 text-center text-sm">
				{/* @ts-ignore */}
				{dayjs(Date.now() + pool.duration * 1000).toNow(true)}
			</td>

			<td className="border border-[#252525] p-2 text-center text-sm">
				{data &&
					`${Number(new BigNumber(pool.repayment).div(10 ** data.decimals).toString()).toLocaleString(undefined, {
						maximumFractionDigits: 2
					})} ${data.symbol}`}
			</td>

			<td className="h-[2.625rem] border border-[#252525] p-2 text-center text-sm font-light">
				{`${((1 - Number(pool.amount) / Number(pool.repayment)) * 100).toFixed(2)}%`}
			</td>

			<td className="border border-[#252525] p-2 text-center text-sm">
				<Tooltip content={new Date(Number(pool.expires) * 1000).toLocaleString()}>
					<span className="mx-auto">{new Date(Number(pool.expires) * 1000).toLocaleDateString()}</span>
				</Tooltip>
			</td>
		</tr>
	)
}
