import * as React from 'react'
import Link from 'next/link'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import ItemWrapper from './ItemWrapper'
import type { IBorrowPool } from '~/types'
import { formatCurrentAnnualInterest } from '~/utils'
import pools from '~/lib/pools'

// @ts-ignore
dayjs.extend(relativeTime)

interface IBorrowPoolItemProps {
	data: IBorrowPool
	chainId?: number | null
	chainName: string
}

export function BorrowPoolItem({ data, chainId, chainName }: IBorrowPoolItemProps) {
	const poolDeployer = pools[chainId || 1]?.find(
		(pool) => pool.poolAddress.toLowerCase() === data.address.toLowerCase()
	)?.deployerName

	return (
		<ItemWrapper>
			<div className="relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
				<span className="absolute -bottom-5 left-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55]"></span>
			</div>
			<h1>{data.name + (poolDeployer ? ` by ${poolDeployer}` : '')}</h1>

			<div className="grid grid-cols-2 gap-3">
				<p className="col-span-1 flex flex-col gap-1">
					<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
					{/* @ts-ignore */}
					<span>{dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}</span>
				</p>
				<p className="col-span-1 flex flex-col items-end gap-1">
					<span className="text-xs font-light text-gray-400">LTV</span>
					<span>{data.ltv / 1e16}%</span>
				</p>
				<p className="col-span-1 flex flex-col gap-1">
					<span className="text-xs font-light text-gray-400">Current Interest</span>
					<span>{formatCurrentAnnualInterest(data.currentAnnualInterest)}% p.a.</span>
				</p>
				<p className="col-span-1 flex flex-col items-end gap-1">
					<span className="text-xs font-light text-gray-400">Borrowable Now</span>
					<span>{data.maxNftsToBorrow}</span>
				</p>
			</div>

			<Link href={`/borrow/${chainName}/${data.address}`}>
				<a className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm">View Pool</a>
			</Link>
		</ItemWrapper>
	)
}

export function PlaceholderBorrowPoolItem() {
	return (
		<ItemWrapper>
			<div className="placeholder-box relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-[#202020]">
				<span
					className="placeholder-box absolute -bottom-5 left-4 h-12 w-12 rounded-full"
					style={{ background: 'linear-gradient(to right, #232323 5%, #252525 20%, #232323 40%)' }}
				></span>
			</div>
			<h1 className="placeholder-box h-6 w-36"></h1>

			<div className="grid grid-cols-2 gap-3">
				<p className="col-span-1 flex flex-col gap-1">
					<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
					<span className="placeholder-box h-6 w-20"></span>
				</p>
				<p className="col-span-1 flex flex-col items-end gap-1">
					<span className="text-xs font-light text-gray-400">LTV</span>
					<span className="placeholder-box h-6 w-20"></span>
				</p>
				<p className="col-span-1 flex flex-col gap-1">
					<span className="text-xs font-light text-gray-400">Current Interest</span>
					<span className="placeholder-box h-6 w-20"></span>
				</p>
				<p className="col-span-1 flex flex-col items-end gap-1">
					<span className="text-xs font-light text-gray-400">Borrowable Now</span>
					<span className="placeholder-box h-6 w-20"></span>
				</p>
			</div>

			<div className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm text-white text-opacity-40">
				<div className="h-5"></div>
			</div>
		</ItemWrapper>
	)
}
