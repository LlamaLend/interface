import * as React from 'react'
import { BorrowItems } from './Borrow'
import { RepayItems } from './Repay'
import type { IBorrowCartProps, IRepayCartProps } from '../types'

export function BorrowCartItems(props: IBorrowCartProps) {
	const { poolData, nftsList, collectionAddress, chainId, isLoading } = props

	if (!poolData) {
		return (
			<p className="relative top-0 bottom-0 my-auto p-6 text-center text-sm">
				Sorry, couldn't find any pools of this collection.
			</p>
		)
	}

	if (!collectionAddress) {
		return (
			<p className="relative top-0 bottom-0 my-auto p-6 text-center text-sm">
				Check the URL validity to view items in cart.
			</p>
		)
	}

	if (!chainId) {
		return (
			<p className="relative top-0 bottom-0 my-auto p-6 text-center text-sm">
				Network not supported, Please check URL validity to view items in cart
			</p>
		)
	}

	return (
		<BorrowItems
			poolData={poolData}
			nftsList={nftsList}
			collectionAddress={collectionAddress}
			chainId={chainId}
			fetchingNftsList={isLoading}
		/>
	)
}

export function RepayCartItems(props: IRepayCartProps) {
	const { userAddress, chainId } = props

	if (!chainId) {
		return (
			<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">
				Network not supported, Check the URL validity to view items in cart
			</p>
		)
	}

	return <RepayItems userAddress={userAddress} chainId={chainId} />
}
