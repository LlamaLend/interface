import * as React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cx } from 'cva'
import { DashboardLinks } from './DashboardLinks'
import Menu from './Menu'
import { CartLink } from './CartLink'
import Notifications from './Notifications'
import useAutoConnect from '~/hooks/useAutoConnect'

interface ILayoutProps {
	children?: React.ReactNode
	style?: React.CSSProperties
	className?: string
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
	useAutoConnect()

	return (
		<>
			<Head>
				<title>LlamaLend</title>
				<meta name="description" content="NFT-collateralized loans for long tail markets." />
			</Head>

			<header className="mx-auto flex w-full max-w-8xl flex-row flex-wrap items-center justify-between gap-4 p-3">
				<DashboardLinks />

				<ConnectButton />

				<span className="flex items-center justify-end gap-3 max-[445px]:ml-auto">
					<Notifications />
					<CartLink />
					<Menu />
				</span>
			</header>

			<React.Suspense fallback={null}>
				<main className={cx('mx-auto flex min-h-full w-full max-w-8xl flex-1 flex-col p-3', className)} {...props}>
					{children}
				</main>
			</React.Suspense>
		</>
	)
}
