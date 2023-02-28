import { IGoblinSaxQuote } from './types'

// eslint-disable-next-line no-undef
const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('x-api-key', process.env.GOBLIN_SAX_API_KEY as string)

export async function getDataGoblinSax(nft: string) {
  try {
    const now = Math.floor(Date.now() / 1e3)
    const res = await fetch(`https://mainnet-api.goblinsax.xyz/api/get-loan-terms?address=${nft.toLowerCase()}&tokenId=0&borrowerAddress=0x0`, {
      headers: requestHeaders
    })
      .then((res) => res.json())

    const result: IGoblinSaxQuote[] = []

    res.body.offers.forEach((duration) => {
      res.body.offers[duration].forEach((offer: any) => {
        result.push({
          token: "ETH",
          price: res.body.price,
          url: 'https://mainnet-api.goblinsax.xyz/api/',
          ltv: offer.ltv,
          apr: offer.apr,
          fee: offer.fee,
          loanPrincipal: offer.loanPrincipal,
          loanRepayment: offer.loanRepayment,
          duration: parseInt(duration).toString()
        })
      })
    })

    return result
  } catch (error) {
    console.error(`Failed to get GoblinSax data: ${error}`)
    return []
  }
}

export async function getGoblinSaxCollections() {

  try {
    const res: {
      data: {
        success: bool,
        whitelist:
        Array<{
          asset_contract: string;
          slug: string;
        }>
      }
    } = await fetch(
      'https://mainnet-api.goblinsax.xyz/api/whitelist',
      {
        headers: requestHeaders
      }
    ).then((res) => res.json())

    if (!res.data.success) {
      console.error(`API returned an error. `)
      return []
    }

    return res.data.whitelist.map((col) => col.asset_contract)

  } catch (error) {
    console.error(`Failed to get GoblinSax collections: ${error}`)
    return []
  }
}