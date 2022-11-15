import * as React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cx } from 'cva'
import AppLink from './AppLink'
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
				<nav className="mr-auto flex w-full items-center gap-3 rounded-xl bg-white p-1 text-base font-semibold text-black sm:w-auto">
					<Image src="/assets/gib.png" alt="" className="hidden sm:block" height={24} width={24} priority />
					<AppLink name="Borrow" path="/" />
					<AppLink name="Repay" path="/repay" />
					<AppLink name="Create Pool" path="/create" />
				</nav>

				<ConnectButton />

				<span className="flex items-center justify-end gap-3 max-[424px]:w-full sm:w-full min-[908px]:w-auto">
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
