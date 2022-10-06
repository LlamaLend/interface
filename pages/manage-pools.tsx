import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import BigNumber from 'bignumber.js'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { InputNumber, InputText } from '~/components/Form'
import Layout from '~/components/Layout'
import { IPoolUtilisationChartProps } from '~/components/Charts/PoolUtilisation'
import { formatMsgInToast } from '~/components/TxToast'
import BeatLoader from '~/components/BeatLoader'
import { FormNames, useCreatePool } from '~/queries/useCreatePool'
import { useDebounce } from '~/hooks'
import { SECONDS_IN_A_DAY, SECONDS_IN_A_YEAR } from '~/lib/constants'

type IFormElements = HTMLFormElement & {
	[key in FormNames]: { value: string }
}

const PoolUtilisationChart = dynamic<IPoolUtilisationChartProps>(() => import('~/components/Charts/PoolUtilisation'), {
	ssr: false,
	loading: () => <div style={{ height: '360px' }}></div>
})

const ManagePools: NextPage = () => {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()
	const { openConnectModal } = useConnectModal()
	const { openChainModal } = useChainModal()
	const { mutate, isLoading, error } = useCreatePool()
	const [minInterest, setMinInterest] = useState<number | null>(null)
	const [maxInterest, setMaxInterest] = useState<number | null>(null)

	const chainSymbol = (!chain?.unsupported && chain?.nativeCurrency?.symbol) ?? 'ETH'

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()

			const form = e.target as IFormElements

			const maxLengthInDays = Number(form.maxLengthInDays.value)
			const maxPrice = Number(form.maxPrice.value)
			const maxDailyBorrows = Number(form.maxDailyBorrows.value)
			const maxInterestPerEthPerSecond = Number(form.maxInterestPerEthPerSecond.value)
			const minimumInterest = Number(form.minimumInterest.value)

			if (
				Number.isNaN(maxLengthInDays) ||
				Number.isNaN(maxPrice) ||
				Number.isNaN(maxDailyBorrows) ||
				Number.isNaN(maxInterestPerEthPerSecond) ||
				Number.isNaN(minimumInterest)
			) {
				throw new Error('Invalid arguments')
			}

			const maxInt = Number(
				new BigNumber(maxInterestPerEthPerSecond / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0)
			)
			const minInt = Number(new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0))

			mutate({
				maxPrice: new BigNumber(maxPrice).times(1e18).toFixed(0),
				nftAddress: form.nftAddress.value,
				maxDailyBorrows: new BigNumber(maxDailyBorrows).times(1e18).toFixed(0),
				name: form.name.value,
				symbol: form.symbol.value,
				maxLength: (maxLengthInDays * SECONDS_IN_A_DAY).toFixed(0),
				maxInterestPerEthPerSecond: (maxInt - minInt).toFixed(0),
				minimumInterest: new BigNumber(minimumInterest / 100).times(1e18).div(SECONDS_IN_A_YEAR).toFixed(0)
			})

			form.reset()
		} catch (error) {
			// console.log(error)
		}
	}

	const debouncedMinInterest = useDebounce(!Number.isNaN(minInterest) ? Number(minInterest) : 0, 200)
	const debouncedMaxInterest = useDebounce(!Number.isNaN(maxInterest) ? Number(maxInterest) : 0, 200)

	const isInvalidInterests =
		minInterest === null || maxInterest === null ? true : debouncedMaxInterest < debouncedMinInterest

	return (
		<div>
			<Head>
				<title>Manage Pools - LlamaLend</title>
			</Head>

			<Layout>
				<form className="max-w-lg mx-auto my-10 mb-20 flex flex-col gap-6" onSubmit={handleSubmit}>
					<h1 className="mb-2 text-3xl font-semibold text-center">Create a Pool</h1>

					<InputNumber
						name="maxPrice"
						placeholder="0.03"
						label={'Maximum price per NFT'}
						helperText={`Maximum ${chainSymbol} people should be able to borrow per NFT, can be changed afterwards. We recommend setting it to current floor price * 0.66`}
						required
					/>

					<InputText
						name="nftAddress"
						placeholder="0x..."
						label={'Address of NFT to borrow'}
						required
						pattern="^0x[a-fA-F0-9]{40}$"
						title="Enter valid address."
					/>

					<InputNumber
						name="maxDailyBorrows"
						placeholder="1"
						label={`Maximum amount of borrowed ${chainSymbol} each day`}
						required
						helperText={`This can be changed afterwards.`}
					/>

					<InputText name="name" placeholder="TubbyLoans" label={'Name of the loan NFTs'} required />

					<InputText name="symbol" placeholder="TL" label={'Symbol of the loans NFTs'} required />

					<InputNumber
						name="maxLengthInDays"
						placeholder="14"
						label={'Maximum duration of loans in days'}
						required
						helperText={`This can be changed afterwards.`}
					/>

					<InputNumber
						name="minimumInterest"
						placeholder="40"
						label={`Minimum annual interest`}
						helperText={`This can be changed afterwards.`}
						onChange={(e) => {
							const value = Number(e.target.value)

							if (Number.isNaN(value)) {
								setMinInterest(null)
							} else {
								setMinInterest(value)
							}
						}}
					/>

					<InputNumber
						name="maxInterestPerEthPerSecond"
						placeholder="70"
						label={`Maximum annual interest`}
						helperText={'This can be changed afterwards and must be higher than minimum annual interest.'}
						onChange={(e) => {
							const value = Number(e.target.value)

							if (Number.isNaN(value)) {
								setMaxInterest(null)
							} else {
								setMaxInterest(value)
							}
						}}
					/>

					<PoolUtilisationChart
						minInterest={isInvalidInterests ? 0 : debouncedMinInterest}
						maxInterest={isInvalidInterests ? 0 : debouncedMaxInterest}
					/>

					{error && <small className="text-center text-red-500">{formatMsgInToast(error.message)}</small>}

					{!isConnected ? (
						<button type="button" className="p-2 rounded-lg bg-[#243b55] text-white" onClick={openConnectModal}>
							Connect Wallet
						</button>
					) : chain?.unsupported ? (
						<button type="button" className="p-2 rounded-lg bg-[#243b55] text-white" onClick={openChainModal}>
							Switch Network
						</button>
					) : (
						<button
							className="p-2 rounded-lg bg-[#243b55] text-white disabled:cursor-not-allowed"
							disabled={isLoading || !isConnected || chain?.unsupported || isInvalidInterests}
						>
							{isLoading ? <BeatLoader color="white" /> : 'Create'}
						</button>
					)}
				</form>
			</Layout>
		</div>
	)
}

export default ManagePools

// maxPrice - the max Price people should be able to borrow at, a good baseline is to pick 60% of the current floor of nft
// nftAddress - address of nft to borrow
// maxDailyBorrows - max amount of borrowed ETH each day, using 1 ETH for tubbyloans
// name - name of loan NFTs, eg:"TubbyLoan"
// symbol - symbol of loans NFTs, eg: "TL"
// maxLengthInDays - maximum duration of loans in seconds, eg: 2 weeks would be "1209600", better to make this < 1 mo
// maxInterestPerEthPerSecond - max interest that can be paid, to calculate run (percent * 1e18)/(seconds in 1 year)
// eg: 80% is 0.8e18/1 year = "25367833587", this is what will be charged if pool utilisation is at 100%

{
	/* <span className="flex justify-center items-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Confirming...
							</span> */
}
