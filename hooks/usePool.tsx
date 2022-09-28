import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useTxContext } from '~/contexts'
import useConfig from './useConfig'

interface ICreatePoolArgs {
	maxPrice: number // the max Price people should be able to borrow at, a good baseline is to pick 60% of the current floor of nft
	nftAddress: string // address of nft to borrow
	maxDailyBorrows: number // max amount of borrowed ETH each day, using 1 ETH for tubbyloans
	name: string // name of loan NFTs, eg:"TubbyLoan"
	symbol: string // symbol of loans NFTs, eg: "TL"
	maxLength: number // maximum duration of loans in seconds, eg: 2 weeks would be "1209600", better to make this < 1 mo
	maxInterestPerEthPerSecond: number // max interest that can be paid, to calculate run (percent * 1e18)/(seconds in 1 year) eg: 80% is 0.8e18/1 year = "25367833587", this is what will be charged if pool utilization is at 100%
}

export function useCreatePool(args: ICreatePoolArgs) {
	const { maxPrice, nftAddress, maxDailyBorrows, name, symbol, maxLength, maxInterestPerEthPerSecond } = args
	const txContext = useTxContext()

	const { data: chainConfig } = useConfig()

	const { config } = usePrepareContractWrite({
		addressOrName: chainConfig!.factoryAddress,
		contractInterface: chainConfig!.factoryABI,
		functionName: 'borrow',
		args: [
			chainConfig!.oracleAddress,
			maxPrice,
			nftAddress,
			maxDailyBorrows,
			name,
			symbol,
			maxLength,
			maxInterestPerEthPerSecond
		]
	})

	const contractWrite = useContractWrite({
		...config,
		onSuccess: (data) => {
			txContext.hash!.current = data.hash
			txContext.dialog?.toggle()
		}
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSuccess: () => {},
		onSettled: (data) => {
			if (data?.status === 1) {
				// txSuccess()
			} else {
				// txError()
			}
		}
	})

	return {
		...contractWrite,
		waitForTransaction
	}
}
