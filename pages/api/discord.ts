import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookClient } from 'discord.js'

const failedCollections: {
	[address: string]: number
} = {}

const TEN_MINUTES = 10 * 60 * 1000

export default async function alert(req: NextApiRequest, res: NextApiResponse) {
	const { collectionAddress, errorType } = req.body

	const webhookClient = new WebhookClient({
		id: process.env.ORACLE_WEBHOOK_ID as string,
		token: process.env.ORACLE_WEBHOOK_TOKEN as string
	})

	if (
		collectionAddress &&
		errorType &&
		(!failedCollections[collectionAddress] || Date.now() - failedCollections[collectionAddress] > TEN_MINUTES)
	) {
		failedCollections[collectionAddress] = Date.now()

		const message =
			errorType === 'deadlineExpired'
				? `${collectionAddress} quote outdated`
				: `Failed to fetch ${collectionAddress} oracle`

		webhookClient.send({
			username: 'Oracle Error',
			content: '```' + message + '```'
		})
	}

	res.status(200).json({ success: true })
}
