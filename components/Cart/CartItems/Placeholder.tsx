import Image from 'next/image'

export default function ItemsPlaceholder() {
	return (
		<ul className="flex flex-col gap-4">
			{new Array(2).fill('cp').map((_, index) => (
				<li key={'cp' + index} className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
					<span className="placeholder-box h-10 w-10"></span>
					<span className="flex flex-col flex-wrap justify-between gap-1">
						<span className="placeholder-box h-[14px] w-[8ch]"></span>
						<span className="placeholder-box h-[14px] w-[12ch]"></span>
					</span>

					<span className="ml-auto flex gap-1.5">
						<Image
							src="/assets/ethereum.png"
							height={16}
							width={16}
							className="rounded object-contain"
							alt="ethereum"
						/>
						<span className="placeholder-box h-4 w-[4ch]"></span>
					</span>
				</li>
			))}
		</ul>
	)
}
