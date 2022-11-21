import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookClient } from 'discord.js'

export default function alert(req: NextApiRequest, res: NextApiResponse) {
	const { message } = req.body

	const webhookClient = new WebhookClient({
		id: process.env.ORACLE_WEBHOOK_ID as string,
		token: process.env.ORACLE_WEBHOOK_TOKEN as string
	})

	if (typeof message === 'string') {
		webhookClient.send({
			username: 'Oracle Error',
			content: `${message}`
		})
	}

	res.status(200).json({ success: true })
}
