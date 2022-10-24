interface IPools {
	[chainId: number]: Array<{
		deployerName: string
		deployerAddress: string
		poolAddress: string
	}>
}

const pools: IPools = {
	1: [
		{
			deployerName: '0xngmi',
			deployerAddress: '0x71a15Ac12ee91BF7c83D08506f3a3588143898B5',
			poolAddress: '0x34d0A4B1265619F3cAa97608B621a17531c5626f'
		}
	]
}

export default pools
