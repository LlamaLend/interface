import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { m } from 'framer-motion'
import { useMedia } from '~/hooks'
import { cx } from 'cva'

const variants = {
	open: { opacity: 1, x: 0, display: 'flex' },
	closed: { opacity: 0, x: '100%', display: 'none' }
}

export default function Wrapper({ className, children }: { className?: string; children: React.ReactNode }) {
	const router = useRouter()

	const { cart } = router.query

	const isDesktop = useMedia('(min-width: 80rem)', true)

	const isOpen = isDesktop && typeof cart === 'string' && cart === 'true'

	if (!isDesktop) {
		return null
	}

	return (
		<m.div
			className={cx(
				'sticky top-0 flex max-h-screen w-full max-w-[22.5rem] flex-col gap-6 overflow-auto rounded-xl bg-black px-5 py-4',
				className
			)}
			animate={isOpen ? 'open' : 'closed'}
			variants={variants}
		>
			<span className="flex items-center justify-between gap-4">
				<h1 className="m-0 text-2xl font-medium">Checkout</h1>
				<Link href={router.asPath.split('?cart=true')[0]}>
					<a className="buttonDismiss">
						<span className="sr-only">Close checkout tab</span>
						<svg
							aria-hidden="true"
							fill="none"
							height="10"
							viewBox="0 0 10 10"
							width="10"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
								fill="currentColor"
							></path>
						</svg>
					</a>
				</Link>
			</span>
			{children}
		</m.div>
	)
}
