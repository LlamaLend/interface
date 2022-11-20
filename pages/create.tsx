import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { InputNumber, InputText } from '~/components/Form'
import Layout from '~/components/Layout'
import { IPoolUtilisationChartProps } from '~/components/Charts/PoolUtilisation'
import { formatMsgInToast } from '~/components/TxToast'
import BeatLoader from '~/components/BeatLoader'
import { FormNames, useCreatePool } from '~/queries/useCreatePool'
import { useDebounce } from '~/hooks'
import { formatCreatePoolFormInputs, getMaxPricePerNft } from '~/utils'
import { useGetOracle } from '~/queries/useGetOracle'
import { ERC721_ABI } from '~/lib/constants'
import BigNumber from 'bignumber.js'

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

	const [nftContractAddress, setNftContractAddress] = useState<string | null>(null)
	const [ltv, setLtv] = useState<number | null>(null)
	const [minInterest, setMinInterest] = useState<number | null>(null)
	const [maxInterest, setMaxInterest] = useState<number | null>(null)

	const chainSymbol: string = (!chain?.unsupported ? chain?.nativeCurrency?.symbol : 'ETH') ?? 'ETH'

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()

			const form = e.target as IFormElements

			const maxLengthInDays = Number(form.maxLengthInDays.value)
			const maxPrice = Number(form.maxPrice.value)
			const maxDailyBorrows = Number(form.maxDailyBorrows.value)
			const maximumInterest = Number(form.maximumInterest.value)
			const minimumInterest = Number(form.minimumInterest.value)
			const ltv = Number(form.ltv.value)

			if (
				Number.isNaN(maxLengthInDays) ||
				Number.isNaN(maxPrice) ||
				Number.isNaN(maxDailyBorrows) ||
				Number.isNaN(maximumInterest) ||
				Number.isNaN(minimumInterest) ||
				Number.isNaN(ltv)
			) {
				throw new Error('Invalid arguments')
			}

			mutate(
				formatCreatePoolFormInputs({
					nftAddress: form.nftAddress.value,
					name: form.name.value,
					symbol: form.symbol.value,
					maxPrice,
					maxDailyBorrows,
					maxLengthInDays,
					maximumInterest,
					minimumInterest,
					ltv
				})
			)
		} catch (error) {
			// console.log(error)
		}
	}

	const validCollectionAddress = nftContractAddress ? new RegExp('^0x[a-fA-F0-9]{40}$').test(nftContractAddress) : null

	const debouncedNftContractAddress = useDebounce(validCollectionAddress ? nftContractAddress : null, 200)
	const debouncedMinInterest = useDebounce(!Number.isNaN(minInterest) ? Number(minInterest) : 0, 200)
	const debouncedMaxInterest = useDebounce(!Number.isNaN(maxInterest) ? Number(maxInterest) : 0, 200)

	const isInvalidInterests =
		minInterest === null || maxInterest === null ? true : debouncedMaxInterest < debouncedMinInterest

	const { data: oracle } = useGetOracle({ nftContractAddress: debouncedNftContractAddress, chainId: chain?.id })

	const defaultMaxPrice = getMaxPricePerNft({ oraclePrice: oracle?.price, ltv })

	const {
		data: supportsInterface,
		isLoading: checkingSupportedContract,
		isError: errorCheckingSupportedContract
	} = useContractRead({
		contractInterface: ERC721_ABI,
		addressOrName: nftContractAddress as string,
		functionName: 'supportsInterface',
		args: '0x80ac58cd',
		enabled: validCollectionAddress ? true : false
	})

	return (
		<div>
			<Head>
				<title>Manage Pools - LlamaLend</title>
			</Head>

			<Layout>
				<form className="mx-auto my-10 mb-20 flex max-w-lg flex-col gap-6" onSubmit={handleSubmit}>
					<h1 className="mb-2 text-center text-3xl font-semibold">Create a Pool</h1>

					<InputText
						name="nftAddress"
						placeholder="0x..."
						label={'Address of NFT to lend against'}
						required
						pattern="^0x[a-fA-F0-9]{40}$"
						title="Enter valid address."
						onChange={(e) => setNftContractAddress(e.target.value)}
					/>

					{!errorCheckingSupportedContract &&
						!checkingSupportedContract &&
						!supportsInterface &&
						validCollectionAddress && (
							<small className="-mt-6 text-left text-red-500">
								Creating a pool on ERC1155 contract is not supported.
							</small>
						)}

					<InputText name="name" placeholder="TubbyLoans" label={'Name of the loan NFTs'} required />

					<InputText name="symbol" placeholder="TL" label={'Symbol of the loans NFTs'} required />

					<InputNumber
						name="ltv"
						placeholder="33"
						label={`Loan to Value (%)`}
						helperText={
							'Percentage of money to lend relative to the floor value. This can be changed afterwards. We recommend setting it to 33%.'
						}
						maxLength={2}
						pattern="^(60|[1-5][0-9]?)$"
						title="Enter numbers only. Must be less than or equal to 60"
						onChange={(e) => {
							const value = Number(e.target.value)

							if (Number.isNaN(value)) {
								setLtv(null)
							} else {
								setLtv(value)
							}
						}}
					/>

					<MaxPrice
						chainSymbol={chainSymbol}
						oraclePrice={oracle?.price}
						defaultMaxPrice={defaultMaxPrice}
						key={defaultMaxPrice}
					/>

					<InputNumber
						name="maxDailyBorrows"
						placeholder="1"
						label={`Maximum amount of borrowed ${chainSymbol} each day`}
						required
						helperText={`This works like a rate-limit on the pool, so if oracle is hacked, or NFT price suddenly drops to zero due to a hack, this limits the maximum damange that can be done. This can be changed afterwards. Must be higher than price * LTV, otherwise borrows will be blocked.`}
					/>

					<InputNumber name="maxLengthInDays" placeholder="14" label={'Maximum duration of loans in days'} required />

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
						name="maximumInterest"
						placeholder="70"
						label={`Maximum annual interest`}
						helperText={'This can be changed afterwards. Must be higher than minimum annual interest.'}
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
						<button type="button" className="rounded-lg bg-[#243b55] p-2 text-white" onClick={openConnectModal}>
							Connect Wallet
						</button>
					) : chain?.unsupported ? (
						<button type="button" className="rounded-lg bg-[#243b55] p-2 text-white" onClick={openChainModal}>
							Switch Network
						</button>
					) : (
						<button
							className="rounded-lg bg-[#243b55] p-2 text-white disabled:cursor-not-allowed"
							disabled={isLoading || !isConnected || chain?.unsupported || isInvalidInterests || !supportsInterface}
						>
							{isLoading ? <BeatLoader color="white" /> : 'Create'}
						</button>
					)}
				</form>
			</Layout>
		</div>
	)
}

const MaxPrice = ({
	defaultMaxPrice,
	chainSymbol,
	oraclePrice
}: {
	defaultMaxPrice?: string
	chainSymbol: string
	oraclePrice?: string
}) => {
	const [value, setValue] = useState(defaultMaxPrice || '')

	const isInvalidMaxPrice =
		oraclePrice && value !== '' && new BigNumber(value).times(1e18).minus(oraclePrice).toString()?.startsWith('-')

	return (
		<label className="label">
			<span>Maximum floor price</span>
			<input
				className="input-field"
				autoComplete="off"
				autoCorrect="off"
				type="text"
				spellCheck="false"
				pattern="^[0-9]*[.,]?[0-9]*$"
				minLength={1}
				maxLength={79}
				inputMode="decimal"
				title="Enter numbers only."
				name="maxPrice"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="0.03"
				required
			/>
			{oraclePrice && value !== '' && isInvalidMaxPrice ? (
				<small className="text-red-500">Maximum floor price is less that oracle price. Borrows will be disabled.</small>
			) : (
				<small className="text-[#708cbf]">
					Maximum floor price (in ${chainSymbol}) that will be allowed in the oracle. If oracle returns a higher price
					than this borrows will be disabled. This can be changed afterwards.
				</small>
			)}
		</label>
	)
}

export default ManagePools
