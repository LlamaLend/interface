import * as React from 'react'
import { useAccount, useNetwork } from 'wagmi'
import Wrapper from './Wrapper'

export function MobileOnlyCart({ children }: { children: React.ReactNode }) {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	if (!isConnected) {
		return (
			<Wrapper>
				<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	if (chain?.unsupported) {
		return (
			<Wrapper>
				<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">
					Connect wallet to supported network to view items in cart.
				</p>
			</Wrapper>
		)
	}

	return <Wrapper>{children}</Wrapper>
}
