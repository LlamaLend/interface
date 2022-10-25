interface IPools {
	[chainId: number]: Array<{
		ownerName: string
		ownerAddress: string
		poolAddress: string
	}>
}

const pools: IPools = {
	1: [
		{
			ownerName: '0xngmi',
			ownerAddress: '0x48A434CD1FC3F363E66f7A2C28c59C6ccECBf949',
			poolAddress: '0x34d0A4B1265619F3cAa97608B621a17531c5626f'
		},
		{
			ownerName: 'Based Ghouls',
			ownerAddress: '0x475dcaa08a69fa462790f42db4d3bba1563cb474',
			poolAddress: '0x4a71de77dC7B269e942ab2fE5539605f3a2ab61A'
		},
		{
			ownerName: 'deepname99',
			ownerAddress: '0xe822ecac55a3a20bb4b24cdd83401eaa73dd3bb4',
			poolAddress: '0x5bdbb7c0669e67760c19f26e67afc95569157f09'
		},
		{
			ownerName: 'deepname99',
			ownerAddress: '0xe822ecac55a3a20bb4b24cdd83401eaa73dd3bb4',
			poolAddress: '0x5ca32c8bc7ddb96c87b844f7204a74659448f446'
		}
	]
}

export default pools
