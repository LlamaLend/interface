const nftVault: any = [
	{ inputs: [], name: 'DebtCapReached', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'InvalidAmount',
		type: 'error'
	},
	{ inputs: [], name: 'InvalidInsuranceMode', type: 'error' },
	{ inputs: [], name: 'InvalidLength', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'nftIndex', type: 'uint256' }],
		name: 'InvalidNFT',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'bytes32', name: 'nftType', type: 'bytes32' }],
		name: 'InvalidNFTType',
		type: 'error'
	},
	{ inputs: [], name: 'InvalidOracleResults', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'nftIndex', type: 'uint256' }],
		name: 'InvalidPosition',
		type: 'error'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'rate',
				type: 'tuple'
			}
		],
		name: 'InvalidRate',
		type: 'error'
	},
	{ inputs: [], name: 'InvalidStrategy', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'unlockTime', type: 'uint256' }],
		name: 'InvalidUnlockTime',
		type: 'error'
	},
	{ inputs: [], name: 'NoDebt', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'debtAmount', type: 'uint256' }],
		name: 'NonZeroDebt',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'nftIndex', type: 'uint256' }],
		name: 'PositionInsuranceExpired',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'nftIndex', type: 'uint256' }],
		name: 'PositionInsuranceNotExpired',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'nftIndex', type: 'uint256' }],
		name: 'PositionLiquidated',
		type: 'error'
	},
	{ inputs: [], name: 'Unauthorized', type: 'error' },
	{
		inputs: [{ internalType: 'uint8', name: 'action', type: 'uint8' }],
		name: 'UnknownAction',
		type: 'error'
	},
	{ inputs: [], name: 'ZeroAddress', type: 'error' },
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
			}
		],
		name: 'Borrowed',
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
			}
		],
		name: 'InsuranceExpired',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'liquidator',
				type: 'address'
			},
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
			{ indexed: false, internalType: 'bool', name: 'insured', type: 'bool' }
		],
		name: 'Liquidated',
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
			}
		],
		name: 'PositionClosed',
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
			}
		],
		name: 'PositionOpened',
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
			}
		],
		name: 'Repaid',
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
			}
		],
		name: 'Repurchased',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'previousAdminRole',
				type: 'bytes32'
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'newAdminRole',
				type: 'bytes32'
			}
		],
		name: 'RoleAdminChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address'
			}
		],
		name: 'RoleGranted',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address'
			}
		],
		name: 'RoleRevoked',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nftIndex',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'strategy',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isStandard',
				type: 'bool'
			}
		],
		name: 'StrategyDeposit',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nftIndex',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'strategy',
				type: 'address'
			}
		],
		name: 'StrategyWithdrawal',
		type: 'event'
	},
	{
		inputs: [],
		name: 'DEFAULT_ADMIN_ROLE',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'accrue',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
		name: 'addStrategy',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' },
			{ internalType: 'uint256', name: '_amount', type: 'uint256' },
			{ internalType: 'bool', name: '_useInsurance', type: 'bool' }
		],
		name: 'borrow',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' },
			{ internalType: 'address', name: '_recipient', type: 'address' }
		],
		name: 'claimExpiredInsuranceNFT',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }],
		name: 'closePosition',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'collect',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' },
			{ internalType: 'uint256', name: '_strategyIndex', type: 'uint256' },
			{ internalType: 'bytes', name: '_additionalData', type: 'bytes' }
		],
		name: 'depositInStrategy',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint8[]', name: '_actions', type: 'uint8[]' },
			{ internalType: 'bytes[]', name: '_datas', type: 'bytes[]' }
		],
		name: 'doActions',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getCreditLimit',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }],
		name: 'getDebtInterest',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_owner', type: 'address' },
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }
		],
		name: 'getLiquidationLimit',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
		name: 'getRoleAdmin',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getStrategies',
		outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' }
		],
		name: 'grantRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' }
		],
		name: 'hasRole',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'contract IStableCoin',
				name: '_stablecoin',
				type: 'address'
			},
			{
				internalType: 'contract IERC721Upgradeable',
				name: '_nftContract',
				type: 'address'
			},
			{
				internalType: 'contract INFTValueProvider',
				name: '_nftValueProvider',
				type: 'address'
			},
			{
				components: [
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'debtInterestApr',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused15',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused16',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused17',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused18',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused12',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'organizationFeeRate',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'insurancePurchaseRate',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'insuranceLiquidationPenaltyRate',
						type: 'tuple'
					},
					{
						internalType: 'uint256',
						name: 'insuranceRepurchaseTimeLimit',
						type: 'uint256'
					},
					{ internalType: 'uint256', name: 'borrowAmountCap', type: 'uint256' }
				],
				internalType: 'struct PETHNFTVault.VaultSettings',
				name: '_settings',
				type: 'tuple'
			}
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }],
		name: 'isLiquidatable',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' },
			{ internalType: 'address', name: '_recipient', type: 'address' }
		],
		name: 'liquidate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'nftContract',
		outputs: [
			{
				internalType: 'contract IERC721Upgradeable',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'nftValueProvider',
		outputs: [{ internalType: 'contract INFTValueProvider', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'openPositionsIndexes',
		outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'positionOwner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'positions',
		outputs: [
			{
				internalType: 'enum PETHNFTVault.BorrowType',
				name: 'borrowType',
				type: 'uint8'
			},
			{ internalType: 'uint256', name: 'debtPrincipal', type: 'uint256' },
			{ internalType: 'uint256', name: 'debtPortion', type: 'uint256' },
			{
				internalType: 'uint256',
				name: 'debtAmountForRepurchase',
				type: 'uint256'
			},
			{ internalType: 'uint256', name: 'liquidatedAt', type: 'uint256' },
			{ internalType: 'address', name: 'liquidator', type: 'address' },
			{
				internalType: 'contract INFTStrategy',
				name: 'strategy',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
		name: 'removeStrategy',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' }
		],
		name: 'renounceRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' },
			{ internalType: 'uint256', name: '_amount', type: 'uint256' }
		],
		name: 'repay',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '_nftIndex', type: 'uint256' }],
		name: 'repurchase',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'contract IERC20Upgradeable',
				name: '_token',
				type: 'address'
			},
			{ internalType: 'uint256', name: '_amount', type: 'uint256' }
		],
		name: 'rescueToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' }
		],
		name: 'revokeRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'debtInterestApr',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused15',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused16',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused17',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused18',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'unused12',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'organizationFeeRate',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'insurancePurchaseRate',
						type: 'tuple'
					},
					{
						components: [
							{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
							{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
						],
						internalType: 'struct PETHNFTVault.Rate',
						name: 'insuranceLiquidationPenaltyRate',
						type: 'tuple'
					},
					{
						internalType: 'uint256',
						name: 'insuranceRepurchaseTimeLimit',
						type: 'uint256'
					},
					{ internalType: 'uint256', name: 'borrowAmountCap', type: 'uint256' }
				],
				internalType: 'struct PETHNFTVault.VaultSettings',
				name: '_settings',
				type: 'tuple'
			}
		],
		name: 'setSettings',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'settings',
		outputs: [
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'debtInterestApr',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'unused15',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'unused16',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'unused17',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'unused18',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'unused12',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'organizationFeeRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'insurancePurchaseRate',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'uint128', name: 'numerator', type: 'uint128' },
					{ internalType: 'uint128', name: 'denominator', type: 'uint128' }
				],
				internalType: 'struct PETHNFTVault.Rate',
				name: 'insuranceLiquidationPenaltyRate',
				type: 'tuple'
			},
			{
				internalType: 'uint256',
				name: 'insuranceRepurchaseTimeLimit',
				type: 'uint256'
			},
			{ internalType: 'uint256', name: 'borrowAmountCap', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'stablecoin',
		outputs: [{ internalType: 'contract IStableCoin', name: '', type: 'address' }],
		stateMutability: 'view',
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
		name: 'totalDebtAmount',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalFeeCollected',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalPositions',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'unused14',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256[]', name: '_nftIndexes', type: 'uint256[]' }],
		name: 'withdrawFromStrategy',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]

export default nftVault
