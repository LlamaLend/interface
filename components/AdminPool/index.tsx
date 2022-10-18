import { useState } from 'react'
import BeatLoader from '~/components/BeatLoader'
import type { IBorrowPool } from '~/types'
import { chainConfig } from '~/lib/constants'
import useUpdateLtv from '~/queries/admin/useChangeLtv'
import useSetMaxPrice from '~/queries/admin/useSetMaxPrice'
import useSetMaxDailyBorrows from '~/queries/admin/useSetMaxDailyBorrows'
import useDeposit from '~/queries/admin/useDeposit'
import useWithdraw from '~/queries/admin/useWithdraw'
import useEmergencyShutdown from '~/queries/admin/useEmergencyShutdown'
// import useSetMaxLoanLength from '~/queries/admin/useSetMaxLoanLength'

export default function AdminPool({
	data,
	chainId,
	userAddress
}: {
	data: IBorrowPool
	chainId: number
	userAddress: string
}) {
	const config = chainConfig(chainId)

	const { nftName, poolBalance, maxPrice, maxDailyBorrows } = data.adminPoolInfo

	const [ltv, setLtv] = useState<string>((data.ltv / 1e16).toFixed(0))

	const [newMaxPrice, setNewMaxPrice] = useState<string>(maxPrice ? (maxPrice / 1e18).toFixed(3) : '')

	const [newMaxDailyBorrows, setNewMaxDailyBorrows] = useState<string>(
		maxDailyBorrows ? (maxDailyBorrows / 1e18).toFixed(3) : ''
	)

	const [amountToDeposit, setAmountToDeposit] = useState<string>('')
	const [amountToWithdraw, setAmountToWithdraw] = useState<string>('')

	// const [newMaxLoanLength, setNewMaxLoanLength] = useState<string>(
	// 	maxLoanLength ? (maxLoanLength / SECONDS_IN_A_DAY).toString() : ''
	// )

	const {
		write: updateLtv,
		isLoading: approvingLtvChange,
		waitForTransaction: { isLoading: confirmingLtvChange }
	} = useUpdateLtv({
		newLtv: ltv,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateMaxPrice,
		isLoading: approvingMaxPriceChange,
		waitForTransaction: { isLoading: confirmingMaxPriceChange }
	} = useSetMaxPrice({
		newMaxPrice,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateMaxDailyBorrows,
		isLoading: approvingDailyBorrowsChange,
		waitForTransaction: { isLoading: confirmingDailyBorrowsChange }
	} = useSetMaxDailyBorrows({
		newMaxDailyBorrows,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	// const {
	// 	write: updateMaxLoanLength,
	// 	isLoading: approvingLoanLengthChange,
	// 	waitForTransaction: { isLoading: confirmingLoanLengthChange }
	// } = useSetMaxLoanLength({
	// 	newMaxLoanLength,
	// 	chainId,
	// 	userAddress,
	// 	poolAddress: data.address
	// })

	const {
		write: deposit,
		isLoading: approvingDeposit,
		waitForTransaction: { isLoading: confirmingDeposit }
	} = useDeposit({
		amountToDeposit,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: withdraw,
		isLoading: approvingWithdraw,
		waitForTransaction: { isLoading: confirmingWithdraw }
	} = useWithdraw({
		amountToWithdraw,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: emergencyShutdown,
		isLoading: approvingShutdown,
		waitForTransaction: { isLoading: confirmingShutdown }
	} = useEmergencyShutdown({
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const chainSymbol = config.nativeCurrency?.symbol

	return (
		<div className="flex w-full max-w-2xl flex-col gap-4 rounded-xl bg-[#191919] p-4 shadow">
			<p className="text-xs font-light text-gray-400">Pool</p>
			<h1 className="-my-4 text-lg">{`${data.name} (${data.symbol})`}</h1>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.address}`}
				className="w-fit break-all text-xs"
			>
				{data.address}
			</a>

			<p className="text-xs font-light text-gray-400">Collection</p>
			<h2 className="-my-4 min-h-[1.75rem] text-lg">{nftName}</h2>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.nftContract}`}
				className="w-fit break-all text-xs"
			>
				{data.nftContract}
			</a>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Balance</span>
				<span className="min-h-[1.5rem] break-all">{poolBalance && `${poolBalance / 1e18} ${chainSymbol}`}</span>
			</p>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Borrowable Now</span>
				<span>{data.maxNftsToBorrow}</span>
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateLtv?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Loan to Value (in %)</span>
					<input
						name="ltv"
						placeholder="33"
						minLength={1}
						maxLength={2}
						pattern="^(60|[1-5][0-9]?)$"
						title="Enter numbers only. Must be less than or equal to 60"
						value={ltv}
						onChange={(e) => setLtv(e.target.value)}
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!updateLtv || approvingLtvChange || confirmingLtvChange ? true : false}
				>
					{approvingLtvChange || confirmingLtvChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateMaxPrice?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Maximum {chainSymbol} per NFT</span>
					<input
						name="maxPrice"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={newMaxPrice}
						onChange={(e) => setNewMaxPrice(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!updateMaxPrice || approvingMaxPriceChange || confirmingMaxPriceChange ? true : false}
				>
					{approvingMaxPriceChange || confirmingMaxPriceChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateMaxDailyBorrows?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Maximum amount of borrowed {chainSymbol} each day</span>
					<input
						name="maxDailyBorrows"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={newMaxDailyBorrows}
						onChange={(e) => setNewMaxDailyBorrows(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!updateMaxDailyBorrows || approvingDailyBorrowsChange || confirmingDailyBorrowsChange ? true : false
					}
				>
					{approvingDailyBorrowsChange || confirmingDailyBorrowsChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>
			{/* 
			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateMaxLoanLength?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Maximum duration of loans in days</span>
					<input
						name="maxLengthInDays"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						inputMode="decimal"
						title="Enter numbers only."
						value={newMaxLoanLength}
						onChange={(e) => setNewMaxLoanLength(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!updateMaxLoanLength || approvingLoanLengthChange || confirmingLoanLengthChange ? true : false}
				>
					{approvingLoanLengthChange || confirmingLoanLengthChange ? <BeatLoader /> : 'Update'}
				</button>
			</form> */}

			<form
				onSubmit={(e) => {
					e.preventDefault()
					deposit?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Deposit {chainSymbol}</span>
					<input
						name="amountToDeposit"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={amountToDeposit}
						onChange={(e) => setAmountToDeposit(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!deposit || approvingDeposit || confirmingDeposit ? true : false}
				>
					{approvingDeposit || confirmingDeposit ? <BeatLoader /> : 'Deposit'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					withdraw?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Withdraw {chainSymbol}</span>
					<input
						name="amountToWithdraw"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={amountToWithdraw}
						onChange={(e) => setAmountToWithdraw(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!withdraw || approvingWithdraw || confirmingWithdraw ? true : false}
				>
					{approvingWithdraw || confirmingWithdraw ? <BeatLoader /> : 'Withdraw'}
				</button>
			</form>

			<button
				className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-red-700 p-2 text-center text-sm text-white disabled:cursor-not-allowed"
				disabled={!emergencyShutdown || approvingShutdown || confirmingShutdown ? true : false}
				onClick={() => emergencyShutdown?.()}
			>
				{approvingShutdown || confirmingShutdown ? <BeatLoader /> : 'Shutdown Borrows'}
			</button>
		</div>
	)
}
