import { useMemo } from 'react'
import { useDebounce } from '~/hooks'
import { Select, SelectArrow, SelectItem, SelectLabel, SelectPopover, useSelectState } from 'ariakit'
import { Combobox, useComboboxState } from 'ariakit/combobox'
import { useRouter } from 'next/router'

export function AggregatorCollectionsSelect({
	collections,
	collectionAddress,
	collectionName
}: {
	collections: Array<{ name: string; address: string }>
	collectionAddress?: string
	collectionName?: string | null
}) {
	const router = useRouter()

	const combobox = useComboboxState({ gutter: 4, sameWidth: true })
	// value and setValue shouldn't be passed to the select state because the
	// select value and the combobox value are different things.
	const { value, setValue, ...selectProps } = combobox

	const select = useSelectState({
		...selectProps,
		value: collectionAddress,
		setValue: (newCol) =>
			router.push({ pathname: router.pathname, query: { collection: newCol } }, undefined, {
				shallow: true
			})
	})

	// Resets combobox value when popover is collapsed
	if (!select.mounted && combobox.value) {
		combobox.setValue('')
	}

	const comboboxValue = useDebounce(combobox.value.toLowerCase().trim(), 300)

	const filteredCollections = useMemo(() => {
		if (comboboxValue && comboboxValue !== '') {
			return collections.filter(
				(col) => col.address.includes(comboboxValue) || col.name.toLowerCase().includes(comboboxValue)
			)
		}

		return collections
	}, [comboboxValue, collections])

	return (
		<div className="mx-auto mt-[5%] flex w-full max-w-lg flex-col gap-2 p-4">
			<SelectLabel state={select}>Collections</SelectLabel>
			<Select state={select} className="flex flex-nowrap items-center gap-2 rounded-md bg-[#060606] px-4 py-2">
				<img
					src={`https://icons.llamao.fi/icons/nfts/${select.value}?h=20&w=20`}
					alt=""
					aria-hidden
					className="h-5 w-5 rounded-full"
				/>

				<span className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap">
					{collectionName || select.value}
				</span>
				<SelectArrow />
			</Select>
			<a
				href={`https://etherscan.io/address/${select.value}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-xs text-white text-opacity-50 underline"
			>
				{select.value}
			</a>
			<SelectPopover
				state={select}
				composite={false}
				className="z-50 flex max-h-[min(var(--popover-available-height,300px),300px)] flex-col overflow-auto overscroll-contain rounded-md bg-[#060606] pb-2"
			>
				<div className="sticky top-0 mb-2 w-full bg-[#060606] px-4 pt-4 pb-2">
					<Combobox
						state={combobox}
						placeholder="Search..."
						className="w-full rounded bg-neutral-900 p-1 px-2 text-white"
					/>
				</div>

				{filteredCollections.map((collection) => (
					<SelectItem
						key={collection.address}
						value={collection.address}
						className="flex cursor-pointer scroll-m-2 flex-nowrap items-center gap-2 px-4 py-2	data-[active-item]:bg-gray-600 data-[active-item]:bg-opacity-20"
					>
						<img
							src={`https://icons.llamao.fi/icons/nfts/${collection.address}?h=20&w=20`}
							alt=""
							aria-hidden
							className="h-5 w-5 rounded-full"
						/>
						<span className="overflow-hidden text-ellipsis whitespace-nowrap">{collection.name}</span>
					</SelectItem>
				))}
			</SelectPopover>
		</div>
	)
}
