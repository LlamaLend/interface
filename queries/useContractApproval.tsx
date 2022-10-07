import {
	erc721ABI,
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
	usePrepareContractWrite,
	useWaitForTransaction
} from 'wagmi'
import { txError } from '~/components/TxToast'
import { chainConfig } from '~/lib/constants'

interface IContractApprovalProps {
	poolAddress: string
	nftContractAddress: string
}

export function useSetContractApproval({ poolAddress, nftContractAddress }: IContractApprovalProps) {
	const { chain } = useNetwork()

	const cConfig = chainConfig(chain?.id)

	const { config } = usePrepareContractWrite({
		addressOrName: nftContractAddress,
		contractInterface: erc721ABI,
		functionName: 'setApprovalForAll',
		args: [poolAddress, true]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0) }
	})

	const contractWrite = useContractWrite(config)

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			if (data?.status === 0) {
				txError({ txHash: contractWrite.data?.hash ?? '', blockExplorer: cConfig.blockExplorer })
			}
		}
	})

	return { ...contractWrite, waitForTransaction }
}

export function useGetContractApproval({ poolAddress, nftContractAddress }: IContractApprovalProps) {
	const { address } = useAccount()

	return useContractRead({
		addressOrName: nftContractAddress,
		contractInterface: erc721ABI,
		functionName: 'isApprovedForAll',
		args: [address, poolAddress]
	})
}
