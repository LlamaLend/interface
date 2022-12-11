import { NFT_LIST_URL_PREFIX } from './constants'

export interface IToken {
	name: string
	address: string
	symbol: string
	chainId: number
	logoURI: string
}

export interface ITokenList {
	version: {
		major: number
		minor: number
		patch: number
	}
	tokens: Array<IToken>
}

interface ICollection {
	[chainId: number]: Array<{
		name: string
		address: string
		imgUrl: string
	}>
}

export function tokenListToCollection(tokenlist: ITokenList): ICollection {
	const collections: ICollection = {}
	tokenlist.tokens.forEach((token) => {
		const chainCollections = collections[token.chainId] ?? []
		chainCollections.push({
			name: token.name,
			address: token.address,
			imgUrl: `${NFT_LIST_URL_PREFIX}/${token.chainId}/${token.address}.png`
		})
		collections[token.chainId] = chainCollections
	})
	return collections
}

// Verified collections, used for sort sequence and static rendering
const collections: { [chainId: number]: string[] } = {
	1: [
		'0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD', // Tubby Cats
		'0xeF1a89cbfAbE59397FfdA11Fc5DF293E9bC5Db90', // Based Ghouls
		'0xf17bb82b6e9cc0075ae308e406e5198ba7320545', // Bond Bears
		'0x2c889A24AF0d0eC6337DB8fEB589fa6368491146', // Boo Bears
		'0x9E629D779bE89783263D4c4A765c38Eb3f18671C', // Baby Bears
		'0xB4E570232D3E55D2ee850047639DC74DA83C7067', // Baby Bears
		'0x32bb5a147b5371fd901aa4a72b7f82c58a87e36d', // Bit Bears
		'0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258', // Otherdeed
		'0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B', // Lil Nouns
		'0x16de9D750F4AC24226154C40980Ef83d4D3fD4AD', // Ethlizards
		'0xe9b91d537c3Aa5A3fA87275FBD2e4feAAED69Bd0', // Crypto Marcs
		'0x1D20A51F088492A0f1C57f047A9e30c9aB5C07Ea', // Wassies
		'0xF210D5d9DCF958803C286A6f8E278e4aC78e136E', // Jay Pegs Auto Mart
		'0x524cAB2ec69124574082676e6F654a18df49A048', // Lil Pudgys
		'0x5Af0D9827E0c53E4799BB226655A1de152A425a5', // Milady
		'0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', // Pudgy Penguins
		'0x394E3d3044fC89fCDd966D3cb35Ac0B32B0Cda91' // RENGA
	],
	5: [
		'0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b' // MultiFaucet NFT
	]
}

export default collections
