import Image from 'next/future/image'

export default function ItemsPlaceholder() {
	return (
		<ul className="flex flex-col gap-4">
			{new Array(2).fill('cp').map((_, index) => (
				<li key={'cp' + index} className="relative flex items-center gap-1.5 text-sm font-medium rounded-xl isolate">
					<span className="placeholder-box h-10 w-10"></span>
					<span className="flex flex-col justify-between flex-wrap gap-1">
						<span className="placeholder-box h-[14px] w-[8ch]"></span>
						<span className="placeholder-box h-[14px] w-[12ch]"></span>
					</span>

					<span className="flex gap-1.5 ml-auto">
						<Image
							src="/assets/ethereum.png"
							height={16}
							width={16}
							className="object-contain rounded"
							alt="ethereum"
						/>
						<span className="placeholder-box h-4 w-[4ch]"></span>
					</span>
				</li>
			))}
		</ul>
	)
}
