import { Menu as AriaMenu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu'
import Link from 'next/link'

export default function Menu() {
	const menu = useMenuState({ gutter: 8 })

	return (
		<>
			<MenuButton state={menu} className="rounded-xl bg-white px-2 py-2 text-black">
				<span className="sr-only">Open Menu</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
					/>
				</svg>
			</MenuButton>
			<AriaMenu
				state={menu}
				className="z-10 flex h-full max-h-96 min-w-[160px] flex-col overflow-auto overscroll-contain rounded-lg border border-[#292929] bg-white py-2 text-black shadow-xl"
			>
				<MenuItem as="span" className="flex">
					<Link href="/manage" className="w-full px-4 py-2 hover:bg-gray-100">
						Manage Pools
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/liquidate" className="w-full px-4 py-2 hover:bg-gray-100">
						Liquidate
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/lender" className="w-full px-4 py-2 hover:bg-gray-100">
						Lender Stats
					</Link>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-gray-100"
					href="https://github.com/LlamaLend/contracts/blob/master/README.md"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Docs</span>
				</MenuItem>

				<MenuItem as="a" className="w-full px-4 py-2 hover:bg-gray-100" href="https://safe.llamalend.com">
					<span>Safe App</span>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-gray-100"
					href="https://twitter.com/llamalend"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Twitter</span>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-gray-100"
					href="https://discord.defillama.com/"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Discord</span>
				</MenuItem>
				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-gray-100"
					href="https://github.com/llamalend"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Github</span>
				</MenuItem>
			</AriaMenu>
		</>
	)
}
