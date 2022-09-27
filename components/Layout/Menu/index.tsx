import { Menu as AriaMenu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu'
import Link from 'next/link'

export default function Menu() {
	const menu = useMenuState({ gutter: 8 })

	return (
		<>
			<MenuButton state={menu} className="bg-white text-black rounded-xl px-2 py-1.5 border-2 border-transparent">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
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
				className="bg-gray-700 rounded-lg shadow-md border z-10 border-gray-600 h-full max-h-96 flex flex-col overflow-auto overscroll-contain"
			>
				<MenuItem as="span" className="flex">
					<Link href="/manage-pools" passHref>
						<a className="px-3 py-2 hover:bg-gray-600">Manage Pools</a>
					</Link>
				</MenuItem>
			</AriaMenu>
		</>
	)
}
