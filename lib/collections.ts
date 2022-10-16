interface ICollection {
	[chainId: number]: Array<{
		name: string
		address: string
		imgUrl: string
	}>
}

const collections: ICollection = {
	1: [
		{
			name: 'Tubby Cats',
			address: '0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD',
			imgUrl: '/assets/collection/tubbycats.png'
		}
	],
	5: [
		{
			name: 'MultiFaucet NFT',
			address: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
			imgUrl: '/assets/collection/multifaucet.webp'
		}
	]
}

export default collections
