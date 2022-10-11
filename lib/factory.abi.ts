export const FACTORY_ABI = [
	{
		inputs: [{ internalType: 'contract LendingPool', name: 'implementation_', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
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
			{ indexed: false, internalType: 'address', name: 'pool', type: 'address' }
		],
		name: 'PoolCreated',
		type: 'event'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_oracle', type: 'address' },
			{ internalType: 'uint256', name: '_maxPrice', type: 'uint256' },
			{ internalType: 'address', name: '_nftContract', type: 'address' },
			{ internalType: 'uint256', name: '_maxDailyBorrows', type: 'uint256' },
			{ internalType: 'string', name: '_name', type: 'string' },
			{ internalType: 'string', name: '_symbol', type: 'string' },
			{ internalType: 'uint96', name: '_maxLoanLength', type: 'uint96' },
			{
				components: [
					{ internalType: 'uint256', name: 'maxVariableInterestPerEthPerSecond', type: 'uint256' },
					{ internalType: 'uint256', name: 'minimumInterest', type: 'uint256' },
					{ internalType: 'uint256', name: 'ltv', type: 'uint256' }
				],
				internalType: 'struct LendingPool.Interests',
				name: 'interests',
				type: 'tuple'
			}
		],
		name: 'createPool',
		outputs: [{ internalType: 'contract LendingPool', name: 'pool', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address[]', name: 'pools', type: 'address[]' }],
		name: 'emergencyShutdown',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'implementation',
		outputs: [{ internalType: 'contract LendingPool', name: '', type: 'address' }],
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
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'pool', type: 'address' },
					{
						components: [
							{ internalType: 'uint256', name: 'nft', type: 'uint256' },
							{ internalType: 'uint256', name: 'interest', type: 'uint256' },
							{ internalType: 'uint40', name: 'startTime', type: 'uint40' },
							{ internalType: 'uint216', name: 'borrowed', type: 'uint216' }
						],
						internalType: 'struct LendingPool.Loan[]',
						name: 'loans',
						type: 'tuple[]'
					}
				],
				internalType: 'struct LlamaLendFactory.LoanRepayment[]',
				name: 'loansToRepay',
				type: 'tuple[]'
			}
		],
		name: 'repay',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]
