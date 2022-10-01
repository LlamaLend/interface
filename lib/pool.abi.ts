export const POOL_ABI = [
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
			{ internalType: 'uint256', name: '_minimumInterest', type: 'uint256' },
			{ internalType: 'address', name: '_owner', type: 'address' }
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{ inputs: [], name: 'ApprovalCallerNotOwnerNorApproved', type: 'error' },
	{ inputs: [], name: 'ApprovalQueryForNonexistentToken', type: 'error' },
	{ inputs: [], name: 'BalanceQueryForZeroAddress', type: 'error' },
	{ inputs: [], name: 'MintERC2309QuantityExceedsLimit', type: 'error' },
	{ inputs: [], name: 'MintToZeroAddress', type: 'error' },
	{ inputs: [], name: 'MintZeroQuantity', type: 'error' },
	{ inputs: [], name: 'OwnerQueryForNonexistentToken', type: 'error' },
	{ inputs: [], name: 'OwnershipNotInitializedForExtraData', type: 'error' },
	{ inputs: [], name: 'TransferCallerNotOwnerNorApproved', type: 'error' },
	{ inputs: [], name: 'TransferFromIncorrectOwner', type: 'error' },
	{ inputs: [], name: 'TransferToNonERC721ReceiverImplementer', type: 'error' },
	{ inputs: [], name: 'TransferToZeroAddress', type: 'error' },
	{ inputs: [], name: 'URIQueryForNonexistentToken', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'approved', type: 'address' },
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'Approval',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'operator', type: 'address' },
			{ indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
		],
		name: 'ApprovalForAll',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'uint256', name: 'currentDailyBorrows', type: 'uint256' },
			{ indexed: false, internalType: 'uint256', name: 'newBorrowedAmount', type: 'uint256' }
		],
		name: 'Borrowed',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'uint256', name: 'fromTokenId', type: 'uint256' },
			{ indexed: false, internalType: 'uint256', name: 'toTokenId', type: 'uint256' },
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' }
		],
		name: 'ConsecutiveTransfer',
		type: 'event'
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
			{ indexed: false, internalType: 'uint256', name: 'currentDailyBorrows', type: 'uint256' },
			{ indexed: false, internalType: 'uint256', name: 'amountReduced', type: 'uint256' }
		],
		name: 'ReducedDailyBorrows',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'Transfer',
		type: 'event'
	},
	{ stateMutability: 'nonpayable', type: 'fallback' },
	{
		inputs: [{ internalType: 'address', name: 'liq', type: 'address' }],
		name: 'addLiquidator',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'approve',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: 'nftId', type: 'uint256[]' },
			{ internalType: 'uint216', name: 'price', type: 'uint216' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint256', name: 'maxInterest', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' }
		],
		name: 'borrow',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_maxInterestPerEthPerSecond', type: 'uint256' },
			{ internalType: 'uint256', name: '_minimumInterest', type: 'uint256' }
		],
		name: 'changeInterest',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint216', name: 'price', type: 'uint216' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' }
		],
		name: 'checkOracle',
		outputs: [],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'loanId', type: 'uint256' },
			{ internalType: 'uint256', name: 'liquidatorIndex', type: 'uint256' }
		],
		name: 'claw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'priceOfNextItem', type: 'uint256' }],
		name: 'currentAnnualInterest',
		outputs: [{ internalType: 'uint256', name: 'interest', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{ inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
	{ inputs: [], name: 'emergencyShutdown', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{
		inputs: [],
		name: 'factory',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'getApproved',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getDailyBorrows',
		outputs: [
			{ internalType: 'uint256', name: 'maxInstantBorrow', type: 'uint256' },
			{ internalType: 'uint256', name: 'dailyBorrows', type: 'uint256' },
			{ internalType: 'uint256', name: 'maxDailyBorrowsLimit', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'loanId', type: 'uint256' }],
		name: 'infoToRepayLoan',
		outputs: [
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint256', name: 'totalRepay', type: 'uint256' },
			{ internalType: 'uint256', name: 'principal', type: 'uint256' },
			{ internalType: 'uint256', name: 'interest', type: 'uint256' },
			{ internalType: 'uint256', name: 'lateFees', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'operator', type: 'address' }
		],
		name: 'isApprovedForAll',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'liquidators',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'liquidatorsLength',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'loans',
		outputs: [
			{ internalType: 'uint256', name: 'nft', type: 'uint256' },
			{ internalType: 'uint256', name: 'interest', type: 'uint256' },
			{ internalType: 'uint40', name: 'startTime', type: 'uint40' },
			{ internalType: 'uint216', name: 'borrowed', type: 'uint216' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'maxInterestPerEthPerSecond',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'maxLoanLength',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'maxPrice',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'minimumInterest',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'nftContract',
		outputs: [{ internalType: 'contract IERC721', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'oracle',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'ownerOf',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
		name: 'removeLiquidator',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{ inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{
		inputs: [{ internalType: 'uint256[]', name: 'loanIds', type: 'uint256[]' }],
		name: 'repay',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ internalType: 'bytes', name: '_data', type: 'bytes' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'operator', type: 'address' },
			{ internalType: 'bool', name: 'approved', type: 'bool' }
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'string', name: 'newBaseURI', type: 'string' }],
		name: 'setBaseURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_maxDailyBorrows', type: 'uint256' }],
		name: 'setMaxDailyBorrows',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'newMaxPrice', type: 'uint256' }],
		name: 'setMaxPrice',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'newValue', type: 'address' }],
		name: 'setOracle',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'tokenURI',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalBorrowed',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'transferFrom',
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
	},
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]
