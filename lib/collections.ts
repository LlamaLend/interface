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
		},
		{
			name: 'Otherdeed',
			address: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258',
			imgUrl: '/assets/collection/otherdeed.avif'
		},
		{
			name: 'Lil Nouns',
			address: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
			imgUrl: '/assets/collection/lilnouns.avif'
		},
		{
			name: 'Ethlizards',
			address: '0x16de9D750F4AC24226154C40980Ef83d4D3fD4AD',
			imgUrl: '/assets/collection/ethlizards.avif'
		},
		{
			name: 'Crypto Marcs',
			address: '0xe9b91d537c3Aa5A3fA87275FBD2e4feAAED69Bd0',
			imgUrl: '/assets/collection/cryptomarcs.avif'
		},
		{
			name: 'Wassies',
			address: '0x1D20A51F088492A0f1C57f047A9e30c9aB5C07Ea',
			imgUrl: '/assets/collection/wassies.avif'
		},
		{
			name: 'Jay Pegs Auto Mart',
			address: '0xF210D5d9DCF958803C286A6f8E278e4aC78e136E',
			imgUrl: '/assets/collection/jaypegsautomart.avif'
		},
		{
			name: 'Lil Pudgys',
			address: '0x524cAB2ec69124574082676e6F654a18df49A048',
			imgUrl: '/assets/collection/lilpudgys.avif'
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
