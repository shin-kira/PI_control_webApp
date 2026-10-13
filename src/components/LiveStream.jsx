import { useEffect,useState } from 'react';
import { LiveKitRoom, useConnectionState, useParticipants, useTracks, ParticipantTile } from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

function ConnectionStatus(){
    const state = useConnectionState()
    const participants = useParticipants()
    return (
        <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.75rem',
            zIndex: 20,
            backdropFilter: 'blur(6px)'
        }}>
            {state} ({participants.length})
        </div>
    )
}

function VideoGrid(){
    const tracks = useTracks([Track.Source.Camera], { onlySubscribed: true })
    const videoTracks = tracks.filter(track => track.publication.kind === 'video')

    if (videoTracks.length === 0) {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                background: 'rgba(2, 6, 23, 0.55)',
                borderRadius: 12,
                minHeight: 0
            }}>
                Waiting for video...
            </div>
        )
    }

    return (
        <div style={{
            flex: 1,
            display: 'grid',
            gap: 8,
            minHeight: 0,
            padding: 4
        }}>
            {videoTracks.map(track => (
                <div key={track.publication.trackSid || track.participant.identity} style={{ position: 'relative', minHeight: 0, borderRadius: 12, overflow: 'hidden', background: 'rgba(2, 6, 23, 0.55)' }}>
                    <ParticipantTile trackRef={track} style={{ width: '100%', height: '100%' }} />
                </div>
            ))}
        </div>
    )
}

export function LiveStream(props){
    const RoomName=`${props.boatName}:${props.boatID}`;
    const liveKitUrl="wss://boat-a492rp4j.livekit.cloud"
    const [token, setToken]=useState("")
    const [error, setError]=useState("")
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        let isCancelled = false
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)

        async function fetchToken(){
            try{
                const apiBase = import.meta.env.VITE_API_BASE || ''
                const endpoint = apiBase ? `${apiBase}/get-token` : '/get-token'
                const ret = await fetch(`${endpoint}?room=${encodeURIComponent(RoomName)}&identity=react-viewer`, {
                    signal: controller.signal
                })
                clearTimeout(timeout)
                if (!ret.ok) {
                    throw new Error(`Token request failed: ${ret.status} - ${(await ret.text()).slice(0, 120)}`)
                }
                const contentType = ret.headers.get('content-type') || ''
                if (!contentType.includes('application/json')) {
                    throw new Error(`Expected JSON but got HTML. Check /get-token endpoint. Response: ${(await ret.text()).slice(0, 120)}`)
                }
                const data= await ret.json()
                const resolvedToken = data?.token ?? data
                if (!resolvedToken) {
                    throw new Error("Token is empty")
                }
                if (!isCancelled) {
                    setToken(resolvedToken)
                    setError("")
                    setLoading(false)
                }
            }catch(err){
                clearTimeout(timeout)
                if (!isCancelled) {
                    console.error("Failed to get token:", err)
                    setError(err.message || "Failed to load stream")
                    setLoading(false)
                }
            }
        }
        fetchToken()
        return () => {
            isCancelled = true
            clearTimeout(timeout)
            controller.abort()
        }
    },[RoomName])

    return(
        <div className="livestream-container" style={{ background: '#0f172a' }}>
            {
            error ?
            (
                <p style={{ color: '#38bdf8' }}>{error}</p>
            )
            :
            token ?
            (
                <LiveKitRoom
                token={token}
                serverUrl={liveKitUrl}
                connect={true}
                audio={false}
                video={false}
                onConnected={() => console.log("LiveKit connected")}
                onDisconnected={(reason) => console.log("LiveKit disconnected:", reason)}
                onError={(err) => {
                    console.error("LiveKit error:", err)
                    setError(err.message || "LiveKit connection error")
                }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#0f172a' }}
                >
                    <ConnectionStatus />
                    <VideoGrid />
                </LiveKitRoom>
            )
            :
            <div style={{ color: '#e2e8f0' }}>
                <p>{loading ? "Loading stream..." : "Video is still unavailable"}</p>
                <p style={{ fontSize: '0.75rem', marginTop: 8 }}>Room: {RoomName}</p>
            </div>
            }
        </div>
    )
}
