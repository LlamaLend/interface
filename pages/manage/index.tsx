import type { NextPage } from 'next'
import { useAccount, useNetwork } from 'wagmi'
import ManagePoolsContainer from '~/containers/ManagePoolsContainer'

const Manage: NextPage = () => {
	const { chain } = useNetwork()
	const { address } = useAccount()

	return <ManagePoolsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} userAddress={address} />
}

export default Manage
