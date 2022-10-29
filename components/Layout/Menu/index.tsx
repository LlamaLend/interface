import { Menu as AriaMenu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu'
import Link from 'next/link'

export default function Menu() {
	const menu = useMenuState({ gutter: 8 })

	return (
		<>
			<MenuButton state={menu} className="rounded-xl bg-white px-2 py-2 text-black">
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
				className="z-10 flex h-full max-h-96 min-w-[160px] flex-col overflow-auto overscroll-contain rounded-lg border border-[#292929] bg-[#181818] py-2 shadow-xl"
			>
				<MenuItem as="span" className="flex">
					<Link href="/create" passHref>
						<a className="w-full px-4 py-2 hover:bg-[#292929]">Create Pool</a>
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/manage" passHref>
						<a className="w-full px-4 py-2 hover:bg-[#292929]">Manage Pools</a>
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/liquidate" passHref>
						<a className="w-full px-4 py-2 hover:bg-[#292929]">Liquidate</a>
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/lender" passHref>
						<a className="w-full px-4 py-2 hover:bg-[#292929]">Lender Stats</a>
					</Link>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-[#292929]"
					href="https://github.com/LlamaLend/contracts/blob/master/README.md"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Docs</span>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-[#292929]"
					href="https://twitter.com/llamalend"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Twitter</span>
				</MenuItem>

				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-[#292929]"
					href="https://discord.gg/bzH9yZzvMy"
					target="_blank"
					rel="noreferrer noopener"
				>
					<span>Discord</span>
				</MenuItem>
				<MenuItem
					as="a"
					className="w-full px-4 py-2 hover:bg-[#292929]"
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
