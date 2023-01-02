import { Menu as AriaMenu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cx } from 'cva'
import Image from 'next/image'

function AppLink({ name, path }: { name: string; path: string }) {
	const { pathname } = useRouter()

	const isActive =
		pathname === path ||
		(pathname.startsWith('/borrow') && path === '/') ||
		(pathname.startsWith('/repay') && path === '/repay') ||
		(pathname.startsWith('/collection') && path === '/')

	return (
		<Link
			href={path}
			className={cx(
				'flex-1 whitespace-nowrap rounded-xl border-2 border-transparent py-[2px] px-2 text-center font-systemSans',
				isActive ? 'border-blue-200 bg-blue-50' : ''
			)}
		>
			{name}
		</Link>
	)
}

export function DashboardLinks() {
	const menu = useMenuState({ gutter: 8 })

	return (
		<>
			<MenuButton
				state={menu}
				className="mr-auto flex items-center gap-[6px] rounded-xl bg-white px-2 py-2 text-black lg:hidden"
			>
				<span className="sr-only">Dashboards</span>
				<Image src="/assets/gib.png" alt="" className="block" height={24} width={24} priority />
				<svg fill="none" height="7" width="14" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2.5"
						xmlns="http://www.w3.org/2000/svg"
					></path>
				</svg>
			</MenuButton>
			<AriaMenu
				state={menu}
				className="z-10 flex h-full max-h-96 min-w-[160px] flex-col overflow-auto overscroll-contain rounded-lg border border-[#292929] bg-white py-2 text-black shadow-xl"
			>
				<MenuItem as="span" className="flex">
					<Link href="/" className="w-full px-4 py-2 hover:bg-gray-100">
						Borrow
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/repay" className="w-full px-4 py-2 hover:bg-gray-100">
						Repay
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/create" className="w-full px-4 py-2 hover:bg-gray-100">
						Create Pool
					</Link>
				</MenuItem>

				<MenuItem as="span" className="flex">
					<Link href="/aggregator" className="w-full px-4 py-2 hover:bg-gray-100">
						Aggregator
					</Link>
				</MenuItem>
			</AriaMenu>

			<nav className="mr-auto hidden w-full items-center gap-3 rounded-xl bg-white p-1 text-base font-semibold text-black sm:w-auto lg:flex">
				<Image src="/assets/gib.png" alt="" className="hidden sm:block" height={24} width={24} priority />
				<AppLink name="Borrow" path="/" />
				<AppLink name="Repay" path="/repay" />
				<AppLink name="Create Pool" path="/create" />
				<AppLink name="Aggregator" path="/aggregator" />
			</nav>
		</>
	)
}
