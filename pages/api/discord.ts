import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookClient } from 'discord.js'
import { Redis } from '@upstash/redis'

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL as string,
	token: process.env.UPSTASH_REDIS_REST_TOKEN as string
})

const TEN_MINUTES = 10 * 60 * 1000

export default async function alert(req: NextApiRequest, res: NextApiResponse) {
	const { collectionAddress, errorType } = req.body

	const webhookClient = new WebhookClient({
		id: process.env.ORACLE_WEBHOOK_ID as string,
		token: process.env.ORACLE_WEBHOOK_TOKEN as string
	})

	if (collectionAddress && errorType) {
		const lastUpdated: number | null = await redis.get(collectionAddress.toLowerCase())

		if (!lastUpdated || Date.now() - lastUpdated > TEN_MINUTES) {
			await redis.set(collectionAddress.toLowerCase(), Date.now(), {
				ex: 600
			})

			const message =
				errorType === 'deadlineExpired'
					? `${collectionAddress} quote outdated`
					: `Failed to fetch ${collectionAddress} oracle`

			webhookClient.send({
				username: 'Oracle Error',
				content: '```' + message + '```'
			})
		}
	}

	res.status(200).json({ success: true })
}
