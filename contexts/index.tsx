import { DisclosureState } from 'ariakit'
import { createContext, MutableRefObject, useContext } from 'react'

interface IContext {
	hash: MutableRefObject<string | null> | null
	dialog: DisclosureState | null
}

export const TransactionsContext = createContext<IContext>({ hash: null, dialog: null })

export const useTxContext = () => {
	return useContext(TransactionsContext)
}
