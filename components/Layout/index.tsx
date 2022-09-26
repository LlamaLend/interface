import * as React from 'react'
import Image from 'next/future/image'
import { useAccount, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface ILayoutProps {
	children?: React.ReactNode
	style?: React.CSSProperties
	className?: string
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	return (
		<>
			<header>
				<nav>
					<Image src="/gib.png" alt="llamalenf" height={36} width={36} priority />
				</nav>

				<span>
					<ConnectButton />
				</span>
			</header>

			<React.Suspense fallback={null}>
				<main className={className} {...props}>
					{isConnected && !chain?.unsupported ? children : <></>}
				</main>
			</React.Suspense>
		</>
	)
}
