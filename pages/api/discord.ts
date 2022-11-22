import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookClient } from 'discord.js'
import { Redis } from '@upstash/redis'
import { ethers } from 'ethers'
import { ERC721_ABI } from '~/lib/erc721.abi'
import { chainConfig } from '~/lib/constants'

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL as string,
	token: process.env.UPSTASH_REDIS_REST_TOKEN as string
})

const TEN_MINUTES = 10 * 60 * 1000

const config = chainConfig(1)

export default async function alert(req: NextApiRequest, res: NextApiResponse) {
	const { collectionAddress, outdatedBy } = req.body

	const webhookClient = new WebhookClient({
		id: process.env.ORACLE_WEBHOOK_ID as string,
		token: process.env.ORACLE_WEBHOOK_TOKEN as string
	})

	if (collectionAddress) {
		const lastUpdated: number | null = await redis.get(collectionAddress.toLowerCase())

		if (!lastUpdated || Date.now() - lastUpdated > TEN_MINUTES) {
			await redis.set(collectionAddress.toLowerCase(), Date.now(), {
				ex: 600
			})

			const contract = new ethers.Contract(collectionAddress, ERC721_ABI, config.chainProvider)

			const collectionName = await contract.name()

			const name = collectionName ? `${collectionName} (${collectionAddress})` : collectionAddress

			const message = outdatedBy ? `${name} quote outdated by ${outdatedBy} mins` : `Failed to fetch ${name} oracle`

			webhookClient.send({
				username: 'Oracle Error',
				content: '```' + message + '```'
			})
		}
	}

	res.status(200).json({ success: true })
}
