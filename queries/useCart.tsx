import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import { LOCAL_STORAGE_KEY } from '~/lib/constants'
import { ICart, INftItem, ITransactionError } from '~/types'

// save/remove items from local storage
async function saveItemToCart({
	contractAddress,
	tokenId,
	userAddress
}: {
	contractAddress: string
	tokenId: number
	userAddress?: string
}) {
	try {
		if (!contractAddress || !tokenId || !userAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

		const userItems = storage?.[userAddress]

		if (userItems) {
			let contractItems: Array<number> = userItems[contractAddress] ?? []

			if (contractItems.includes(tokenId)) {
				// removes items from cart
				contractItems = contractItems.filter((item) => item !== tokenId)
			} else {
				// adds items to cart
				contractItems = [...contractItems, tokenId]
			}

			// updates local storage with items
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify({ ...storage, [userAddress]: { ...userItems, [contractAddress]: contractItems } })
			)
		} else {
			// initialise storage
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify({ ...storage, [userAddress]: { [contractAddress]: [tokenId] } })
			)
		}

		// returns user's cart items of given conract address
		return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')[userAddress][contractAddress]
	} catch (error: any) {
		throw new Error("Couldn't add item to cart")
	}
}

// get cart items from local storage
async function fetchCartItems({ contractAddress, userAddress }: { contractAddress: string; userAddress?: string }) {
	try {
		if (!contractAddress || !userAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const prevItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

		return prevItems?.[userAddress]?.[contractAddress] ?? []
	} catch (error: any) {
		throw new Error("Couldn't get items in cart")
	}
}

// *------------------------------------------------*

const useSaveItemToCart = () => {
	const { address } = useAccount()
	const queryClient = useQueryClient()

	const router = useRouter()

	return useMutation(
		({ contractAddress, tokenId }: { contractAddress: string; tokenId: number }) =>
			saveItemToCart({ contractAddress, tokenId, userAddress: address }),
		{
			onMutate: ({ contractAddress }) => {
				const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

				return contractAddress ? cart?.[contractAddress] ?? [] : []
			},
			onSuccess: (data: ICart, variables, prevItems) => {
				const contractAddress = variables.contractAddress

				// If its the first item added to cart, show cart section
				if (
					contractAddress &&
					data[contractAddress]?.length === 1 &&
					data[contractAddress]?.length > prevItems.length
				) {
					router.push({
						pathname: router.pathname,
						query: {
							cart: true
						}
					})
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries()
			}
		}
	)
}

const useGetCartItems = (contractAddress: string) => {
	const { address } = useAccount()
	const { chain } = useNetwork()

	// fetch and filter cart items which are owned by user
	return useQuery<Array<number>, ITransactionError>(['cartItems', address, chain?.id, contractAddress], () =>
		fetchCartItems({ contractAddress, userAddress: address })
	)
}

export { useSaveItemToCart, useGetCartItems }
