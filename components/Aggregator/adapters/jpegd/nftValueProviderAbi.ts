const nftValueProvider: any = [
	{
		inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
		name: 'ExistingLock',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'InvalidAmount',
		type: 'error'
	},
	{ inputs: [], name: 'InvalidLength', type: 'error' },
	{
		inputs: [{ internalType: 'bytes32', name: 'nftType', type: 'bytes32' }],
		name: 'InvalidNFTType',
		type: 'error'
	},
	{ inputs: [], name: 'InvalidOracleResults', type: 'error' },
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: 'rate',
				type: 'tuple'
			}
		],
		name: 'InvalidRate',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'unlockTime', type: 'uint256' }],
		name: 'InvalidUnlockTime',
		type: 'error'
	},
	{ inputs: [], name: 'Unauthorized', type: 'error' },
	{ inputs: [], name: 'ZeroAddress', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'newFloor',
				type: 'uint256'
			}
		],
		name: 'DaoFloorChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'index',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'unlockTime',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isTraitBoost',
				type: 'bool'
			}
		],
		name: 'JPEGLocked',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'index',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isTraitBoost',
				type: 'bool'
			}
		],
		name: 'JPEGUnlocked',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' },
			{
				components: [
					{ internalType: 'address', name: 'owner', type: 'address' },
					{ internalType: 'uint256', name: 'unlockAt', type: 'uint256' },
					{ internalType: 'uint256', name: 'lockedValue', type: 'uint256' }
				],
				internalType: 'struct NFTValueProvider.JPEGLock[]',
				name: '_locks',
				type: 'tuple[]'
			}
		],
		name: 'addLocks',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'aggregator',
		outputs: [
			{
				internalType: 'contract IJPEGOraclesAggregator',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' },
			{ internalType: 'uint256[]', name: '_unlocks', type: 'uint256[]' }
		],
		name: 'applyLTVBoost',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' },
			{ internalType: 'uint256[]', name: '_unlocks', type: 'uint256[]' }
		],
		name: 'applyTraitBoost',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'baseCreditLimitRate',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'baseLiquidationLimitRate',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' },
			{ internalType: 'uint256', name: '_jpegPrice', type: 'uint256' }
		],
		name: 'calculateLTVBoostLock',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: '_nftType', type: 'bytes32' },
			{ internalType: 'uint256', name: '_jpegPrice', type: 'uint256' }
		],
		name: 'calculateTraitBoostLock',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'cigStakedRateIncrease',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'cigStaking',
		outputs: [
			{
				internalType: 'contract IJPEGCardsCigStaking',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'daoFloorOverride',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'disableFloorOverride',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'contract IJPEGCardsCigStaking',
				name: '_cigStaking',
				type: 'address'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_baseCreditLimitRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_baseLiquidationLimitRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_cigStakedRateIncrease',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_jpegLockedRateIncrease',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_ltvBoostLockRate',
				type: 'tuple'
			}
		],
		name: 'finalizeUpgrade',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getCreditLimitETH',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getCreditLimitRate',
		outputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '',
				type: 'tuple'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getFloorETH',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getLiquidationLimitETH',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getLiquidationLimitRate',
		outputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '',
				type: 'tuple'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }],
		name: 'getNFTValueETH',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'contract IERC20Upgradeable',
				name: '_jpeg',
				type: 'address'
			},
			{
				internalType: 'contract IJPEGOraclesAggregator',
				name: '_aggregator',
				type: 'address'
			},
			{
				internalType: 'contract IJPEGCardsCigStaking',
				name: '_cigStaking',
				type: 'address'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_baseCreditLimitRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_baseLiquidationLimitRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_cigStakedRateIncrease',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_jpegLockedRateIncrease',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_traitBoostLockRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_ltvBoostLockRate',
				type: 'tuple'
			},
			{ internalType: 'uint256', name: '_minJPEGToLock', type: 'uint256' }
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'jpeg',
		outputs: [{ internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'jpegLockedRateIncrease',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'ltvBoostLockRate',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'ltvBoostPositions',
		outputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'uint256', name: 'unlockAt', type: 'uint256' },
			{ internalType: 'uint256', name: 'lockedValue', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'minJPEGToLock',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'nftTypeValueMultiplier',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'nftTypes',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_newFloor', type: 'uint256' }],
		name: 'overrideFloor',
		outputs: [],
		stateMutability: 'nonpayable',
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
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_baseCreditLimitRate',
				type: 'tuple'
			}
		],
		name: 'setBaseCreditLimitRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_liquidationLimitRate',
				type: 'tuple'
			}
		],
		name: 'setBaseLiquidationLimitRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_cigStakedRateIncrease',
				type: 'tuple'
			}
		],
		name: 'setCigStakedRateIncrease',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_jpegLockedRateIncrease',
				type: 'tuple'
			}
		],
		name: 'setJPEGLockedRateIncrease',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_ltvBoostLockRate',
				type: 'tuple'
			}
		],
		name: 'setLTVBoostLockRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' },
			{ internalType: 'bytes32', name: '_type', type: 'bytes32' }
		],
		name: 'setNFTType',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: '_type', type: 'bytes32' },
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_multiplier',
				type: 'tuple'
			}
		],
		name: 'setNFTTypeMultiplier',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct NFTValueProvider.Rate',
				name: '_traitBoostLockRate',
				type: 'tuple'
			}
		],
		name: 'setTraitBoostLockRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'traitBoostLockRate',
		outputs: [
			{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
			{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'traitBoostPositions',
		outputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'uint256', name: 'unlockAt', type: 'uint256' },
			{ internalType: 'uint256', name: 'lockedValue', type: 'uint256' }
		],
		stateMutability: 'view',
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
		inputs: [{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' }],
		name: 'withdrawLTVBoost',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' }],
		name: 'withdrawTraitBoost',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]

export default nftValueProvider
