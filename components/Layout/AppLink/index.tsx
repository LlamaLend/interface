import Link from 'next/link'
import { useRouter } from 'next/router'
import { cx } from 'cva'

export default function AppLink({ name, path }: { name: string; path: string }) {
	const { pathname } = useRouter()

	const isActive =
		pathname === path ||
		(pathname.startsWith('/borrow') && path === '/') ||
		(pathname.startsWith('/pools') && path === '/')

	return (
		<Link href={path}>
			<a
				className={cx(
					'flex-1 whitespace-nowrap rounded-xl border-2 border-transparent py-[2px] px-2 text-center',
					isActive ? 'border-blue-200 bg-blue-50' : ''
				)}
			>
				{name}
			</a>
		</Link>
	)
}
