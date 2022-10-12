import * as React from 'react'
import { BorrowItems } from './Borrow'
import { RepayItems } from './Repay'
import type { IBorrowCartProps, IRepayCartProps } from '../types'

export function BorrowCartItems(props: IBorrowCartProps) {
	const { poolAddress, nftContractAddress, chainId, nftCollectionName } = props

	if (!nftContractAddress || !poolAddress || !nftCollectionName) {
		return <p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">Check the URL validity to view items in cart.</p>
	}

	if (!chainId) {
		return (
			<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">
				Network not supported, Please check URL validity to view items in cart
			</p>
		)
	}

	return (
		<BorrowItems
			poolAddress={poolAddress}
			nftContractAddress={nftContractAddress}
			chainId={chainId}
			nftCollectionName={nftCollectionName}
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
