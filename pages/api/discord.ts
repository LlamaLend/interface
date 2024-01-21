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

const THIRTY_MINUTES = 30 * 60 * 1000

const config = chainConfig(1)

export default async function alert(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { collectionAddress, outdatedBy, errorMessage } = req.body

		const webhookClient = new WebhookClient({
			id: process.env.ORACLE_WEBHOOK_ID as string,
			token: process.env.ORACLE_WEBHOOK_TOKEN as string
		})

		if (collectionAddress) {
			const lastUpdated: number | null = await redis.get(collectionAddress.toLowerCase())

			if (!lastUpdated || Date.now() - lastUpdated > THIRTY_MINUTES) {
				await redis.set(collectionAddress.toLowerCase(), Date.now(), {
					ex: 1800
				})

				const contract = new ethers.Contract(collectionAddress, ERC721_ABI, config.chainProvider)

				const collectionName = await contract.name()

				const name = collectionName ? `${collectionName} (${collectionAddress})` : collectionAddress

				const failedToFetch = `Failed to fetch ${name} oracle` + (errorMessage ? ` - ${errorMessage}` : '')

				const message = outdatedBy ? `${name} quote outdated by ${outdatedBy} mins` : failedToFetch

				webhookClient.send({
					username: 'Oracle Error',
					content: '```' + message + '```'
				})
			}
		}

		res.status(200).json({ success: true })
	} catch (e) {}
}
