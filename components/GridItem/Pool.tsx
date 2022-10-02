import * as React from 'react'

import ItemWrapper from './ItemWrapper'
import type { IPool } from '~/hooks/useGetAllPools'

interface IGridItemProps {
	data: IPool
}

export function PoolItem({ data }: IGridItemProps) {
	return (
		<ItemWrapper>
			<></>
		</ItemWrapper>
	)
}
