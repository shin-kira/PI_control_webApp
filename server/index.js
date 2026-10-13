import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { AccessToken } from 'livekit-server-sdk'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }))
app.use(express.json())

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET
const LIVEKIT_URL = process.env.LIVEKIT_URL || 'wss://boat-a492rp4j.livekit.cloud'

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    console.error('Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET')
}

app.get('/get-token', async (req, res) => {
    const room = req.query.room
    const identity = req.query.identity || 'react-viewer'

    if (!room) {
        return res.status(400).json({ error: 'Missing room parameter' })
    }

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        return res.status(500).json({ error: 'Server misconfigured: missing LiveKit credentials' })
    }

    try {
        const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
            identity: identity,
        })

        token.addGrant({
            room,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        })

        const jwt = await token.toJwt()
        res.json({ token: jwt })
    } catch (err) {
        console.error('Failed to generate token:', err)
        res.status(500).json({ error: 'Failed to generate token' })
    }
})

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
