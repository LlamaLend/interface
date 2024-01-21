/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cloudflare-ipfs.com', 'nft.llamalendnft.com', 'res.cloudinary.com', 'nft-cdn.alchemy.com', 'nfts.renga.app', 'icons.llamao.fi'],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '\*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, content-type, Authorization',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
