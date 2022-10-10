import * as React from 'react'
import Image from 'next/future/image'
import { useAccount } from 'wagmi'
import BeatLoader from '~/components/BeatLoader'
import ItemsPlaceholder from './Placeholder'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import { useGetLoansByPool } from '~/queries/useLoans'
import type { IRepayItemProps } from '../types'
import type { ILoan } from '~/types'
import { useRepay } from '~/queries/useRepay'
import type { ILoanToRepay } from '~/queries/useRepay'
import BigNumber from 'bignumber.js'

export function RepayItems({ chainId, loanPoolAddress, loanPoolName }: IRepayItemProps) {
	const { address } = useAccount()

	// query to get cart items from local storage
	const {
		data: cartTokenIds,
		isLoading: fetchingCartItems,
		isError: errorLoadingCartItems
	} = useGetCartItems(loanPoolAddress)

	const {
		data: loans,
		isLoading: fetchingLoans,
		isError: errorFetchingLoans
	} = useGetLoansByPool({
		chainId,
		poolAddress: loanPoolAddress,
		userAddress: address
	})

	const cartItems =
		(cartTokenIds
			?.map((id) => {
				const loan = loans?.find((loan) => loan.id === id)

				if (!loan) return null

				return loan
			})
			.filter((item) => !!item) as Array<ILoan>) ?? []

	// query to save/remove item to cart/localstorage
	const { mutate: saveItemToCart } = useSaveItemToCart()

	const loansToRepay: Array<ILoanToRepay> = cartItems.map((item) => ({
		nft: item.id,
		interest: item.interest,
		startTime: item.startTime,
		borrowed: item.borrowed
	}))

	const totalToRepay = 0.025 // cartItems.reduce((acc, curr) => (acc += curr.toPay), 0)

	const buffer = new BigNumber(totalToRepay).times(0.05).toFixed(0)

	//query to borrow eth using nfts
	const {
		write: repayLoans,
		isLoading: userConfirmingRepay,
		error: errorConfirmingRepay,
		waitForTransaction: { data: repayTxOnChain, isLoading: checkingForRepayTxOnChain, error: txRepayErrorOnChain }
	} = useRepay({
		loanPoolAddress,
		payableAmout: new BigNumber(totalToRepay).plus(buffer).times(1e18).toFixed(0),
		loansToRepay,
		enabled: loansToRepay.length > 0
	})

	// construct error messages
	// Failed queries, but user can't retry with data of these queries
	const errorMsgOfQueries = errorLoadingCartItems
		? "Couldn't fetch items in your cart"
		: errorFetchingLoans
		? "Couldn't fetch items in your cart"
		: null

	// Failed queries, but user can retry
	const errorMsgOfEthersQueries: string | null = errorConfirmingRepay
		? errorConfirmingRepay.message
		: repayTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: txRepayErrorOnChain
		? txRepayErrorOnChain.message
		: null

	// check all loading states to show beat loader
	const isLoading = fetchingCartItems || fetchingLoans || userConfirmingRepay || checkingForRepayTxOnChain

	return (
		<>
			{errorMsgOfQueries ? (
				<p className="mt-5 mb-9 p-6 text-center text-sm text-[#ff9393] xl:mt-[60%]">{errorMsgOfQueries}</p>
			) : cartTokenIds && cartTokenIds.length <= 0 ? (
				<p className="mt-8 mb-9 p-6 text-center xl:mt-[60%]">Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			) : (
				<>
					{/* Show placeholder when fetching items in cart */}
					{fetchingCartItems || fetchingLoans ? (
						<ItemsPlaceholder />
					) : (
						<ul className="flex flex-col gap-4">
							{cartItems?.map(({ id, tokenUri, toPay }) => (
								<li key={id} className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
									<button
										className="absolute -top-2 -left-1.5 z-10 h-5 w-5 rounded-xl bg-white p-1 text-black transition-[1.125s_ease]"
										onClick={() => saveItemToCart({ tokenId: id, contractAddress: loanPoolAddress })}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
										</svg>
										<span className="sr-only">Remove Item from cart</span>
									</button>

									<div className="relative aspect-square h-10 w-10 rounded bg-[#202020]">
										{tokenUri !== '' && <Image src={tokenUri} fill alt="" className="aspect-square rounded-t-xl" />}
									</div>

									<span className="flex flex-col flex-wrap justify-between gap-1">
										<span>{`${id.slice(0, 4) + '...' + id.slice(-3)}`}</span>
										<span className="font-base text-[0.8rem] text-[#989898]">{loanPoolName}</span>
									</span>

									<span className="ml-auto flex gap-1.5">
										<Image
											src="/assets/ethereum.png"
											height={16}
											width={16}
											className="object-contain"
											alt="ethereum"
										/>
										<span>{(toPay / 1e18).toFixed(2)}</span>
									</span>
								</li>
							))}
						</ul>
					)}

					{/* Show error message of txs/queries initiated with wallet */}
					{errorMsgOfEthersQueries && !errorMsgOfEthersQueries.startsWith('user rejected transaction') && (
						<p className="mt-5 text-center text-sm text-[#ff9393]">
							{errorMsgOfEthersQueries.slice(0, 150)}
							{errorMsgOfEthersQueries.length > 150 ? '...' : ''}
						</p>
					)}

					{isLoading ? (
						<button
							className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
							disabled
						>
							<BeatLoader />
						</button>
					) : (
						<button
							className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
							disabled={!repayLoans}
							onClick={() => repayLoans?.()}
						>
							Confirm Repay
						</button>
					)}
				</>
			)}
		</>
	)
}
