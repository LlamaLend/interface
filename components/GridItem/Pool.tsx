import * as React from 'react'
import Link from 'next/link'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import ItemWrapper from './ItemWrapper'
import type { IPool } from '~/hooks/useGetAllPools'

// @ts-ignore
dayjs.extend(relativeTime)

interface IGridItemProps {
	data: IPool
	chainName: string
}

export function PoolItem({ data, chainName }: IGridItemProps) {
	return (
		<ItemWrapper>
			<div className="h-20 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] rounded-t-xl relative -mx-4 -mt-4 mb-4">
				<span className="absolute -bottom-5 left-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55]"></span>
			</div>
			<h1>{data.name}</h1>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
				{/* @ts-ignore */}
				<span>{dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}</span>
			</p>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Current Annual Interest</span>
				<span>{(data.currentAnnualInterest / 1e16).toFixed(2)}% p.a.</span>
			</p>

			<Link href={`/pool/${chainName}/${data.address}`}>
				<a className="text-sm text-center rounded-xl p-2 bg-[#243b55]">View Pool</a>
			</Link>
		</ItemWrapper>
	)
}

export function PlaceHolderPoolItem() {
	return (
		<ItemWrapper>
			<div className="h-20 bg-[#202020] placeholder-box rounded-t-xl relative -mx-4 -mt-4 mb-4">
				<span
					className="absolute -bottom-5 left-4 h-12 w-12 rounded-full placeholder-box"
					style={{ background: 'linear-gradient(to right, #232323 5%, #252525 20%, #232323 40%)' }}
				></span>
			</div>
			<h1 className="h-6 w-36 placeholder-box"></h1>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
				<span className="placeholder-box h-6 w-20"></span>
			</p>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Current Annual Interest</span>
				<span className="placeholder-box h-6 w-20"></span>
			</p>

			<div className="text-sm text-center rounded-xl p-2 bg-[#243b55] cursor-not-allowed text-white text-opacity-40">
				<div className="h-5"></div>
			</div>
		</ItemWrapper>
	)
}
