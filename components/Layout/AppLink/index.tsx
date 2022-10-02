import Link from 'next/link'
import { useRouter } from 'next/router'
import { cx } from 'cva'

export default function AppLink({ name, path }: { name: string; path: string }) {
	const { pathname } = useRouter()

	const isActive = pathname === path || (pathname.startsWith('/pool') && path === '/')

	return (
		<Link href={path}>
			<a
				className={cx(
					'py-[2px] px-2 flex-1 text-center border-2 border-transparent rounded-xl whitespace-nowrap',
					isActive ? 'bg-blue-50 border-blue-200' : ''
				)}
			>
				{name}
			</a>
		</Link>
	)
}
