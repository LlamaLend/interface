export const FACTORY_ABI = [
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'nftContract', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: false, internalType: 'address', name: 'pool', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: '', type: 'uint256' }
		],
		name: 'PoolCreated',
		type: 'event'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'allPools',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'allPoolsLength',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_oracle', type: 'address' },
			{ internalType: 'uint256', name: '_maxPrice', type: 'uint256' },
			{ internalType: 'address', name: '_nftContract', type: 'address' },
			{ internalType: 'uint256', name: '_maxDailyBorrows', type: 'uint256' },
			{ internalType: 'string', name: '_name', type: 'string' },
			{ internalType: 'string', name: '_symbol', type: 'string' },
			{ internalType: 'uint256', name: '_maxLoanLength', type: 'uint256' },
			{ internalType: 'uint256', name: '_maxInterestPerEthPerSecond', type: 'uint256' },
			{ internalType: 'uint256', name: '_minimumInterest', type: 'uint256' }
		],
		name: 'createPool',
		outputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256[]', name: 'pools', type: 'uint256[]' }],
		name: 'emergencyShutdown',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '', type: 'address' },
			{ internalType: 'uint256', name: '', type: 'uint256' }
		],
		name: 'nftPools',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'nftContract', type: 'address' }],
		name: 'nftPoolsLength',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{ inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]
