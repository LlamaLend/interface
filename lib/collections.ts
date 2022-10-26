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
		},
		{
			name: 'Based Ghouls',
			address: '0xeF1a89cbfAbE59397FfdA11Fc5DF293E9bC5Db90',
			imgUrl: '/assets/collection/basedghouls.avif'
		},
		{
			name: 'Bond Bears',
			address: '0xf17bb82b6e9cc0075ae308e406e5198ba7320545',
			imgUrl: '/assets/collection/bondbears.avif'
		},
		{
			name: 'Boo Bears',
			address: '0x2c889A24AF0d0eC6337DB8fEB589fa6368491146',
			imgUrl: '/assets/collection/boobears.avif'
		},
		{
			name: 'Baby Bears',
			address: '0x9E629D779bE89783263D4c4A765c38Eb3f18671C',
			imgUrl: '/assets/collection/babybears.avif'
		},
		{
			name: 'Band Bears',
			address: '0xB4E570232D3E55D2ee850047639DC74DA83C7067',
			imgUrl: '/assets/collection/bandbears.avif'
		},
		{
			name: 'Bit Bears',
			address: '0x32bb5a147b5371fd901aa4a72b7f82c58a87e36d',
			imgUrl: '/assets/collection/bitbears.avif'
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
