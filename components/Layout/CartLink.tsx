import { useRouter } from 'next/router'

export function CartLink() {
	const router = useRouter()

	const { cart, ...queries } = router.query

	const isCartToggled = typeof cart === 'string' && cart === 'true'

	// only show link to cart on pool page
	if (!router.pathname.startsWith('/borrow/')) {
		return null
	}

	return (
		<button
			onClick={() =>
				router.push({
					pathname: router.pathname,
					query: { ...queries, cart: isCartToggled ? false : true }
				})
			}
			className="rounded-xl bg-white px-2 py-2 text-black"
		>
			<span className="sr-only">{isCartToggled ? 'Close Cart' : 'Open Cart'}</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		</button>
	)
}
