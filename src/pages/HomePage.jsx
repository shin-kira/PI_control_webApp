import { useState, useMemo, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { BoatContext } from "../components/StausBars"
import { SideBar, ThrottleProvider } from "../components/SideBar"
import { Headder } from "../components/Headder"
import { StatusBar } from "../components/StausBars"
import { LiveStream } from "../components/LiveStream"
import { writeToStore, subscribeToBoat } from "../firebase/firebaseManager"



export function HomePage(){
    const { boatName, boatID } = useAuth()
    const [driveMode, setDriveMode] = useState("FWD")
    const [switchStatus, setSwitchStatus] = useState("ON")
    const [throttles, setThrottles] = useState({ leftThrottle: 0, rightThrottle: 0 })
    const [relStatus,setRelStatus]=useState("OFF")
    const [telemetry, setTelemetry] = useState(null)

    const boatContextValue = useMemo(() => ({
        driveMode,
        switchStatus,
        relStatus,
        toggleDrive: () => setDriveMode(prev => prev === "FWD" ? "REV" : "FWD"),
        toggleSwitch: () => setSwitchStatus(prev => prev === "ON" ? "OFF" : "ON"),
        toggleRel: () => setRelStatus(prev => prev === "ON" ? "OFF" : "ON"),
        throttles,
        updateThrottle: (name, value) => setThrottles(prev => ({ ...prev, [name]: value }))
    }), [driveMode, switchStatus, relStatus, throttles])

    useEffect(() => {
        writeToStore(boatName, boatID, {
            relay: relStatus==="ON"?1:0,
            switch: switchStatus==="ON"?1:0,
            drive: driveMode==="FWD"?1:0,
            motor_a: throttles.leftThrottle,
            motor_b: throttles.rightThrottle,
        })
    }, [boatName, boatID, driveMode, switchStatus, relStatus, throttles])

    useEffect(() => {
        const unsubscribe = subscribeToBoat(boatName, boatID, (data) => {
            if (data) {
                setTelemetry(data)
            }
        })
        return unsubscribe
    }, [boatName, boatID])

    return(
        <BoatContext.Provider value={boatContextValue}>
            <HomePageContent boatName={boatName} boatID={boatID} telemetry={telemetry} />
        </BoatContext.Provider>
    )
}

function HomePageContent({ boatName, boatID, telemetry }){
    const location = telemetry ? `${telemetry.long}:${telemetry.lat}` : "waiting..."
    const weight = telemetry ? telemetry.weight : "waiting..."

    return(
        <main>
            <Headder boatName={boatName} boatID={boatID} />
            <StatusBar 
            boatName={boatName}
            boatID={boatID}
            location={location}
            weight={weight}
            />
            <div className="dashboard">
                <ThrottleProvider name="leftThrottle">
                    <SideBar name="leftThrottle" />
                </ThrottleProvider>
                <LiveStream boatName={boatName} boatID={boatID}/>
                <ThrottleProvider name="rightThrottle">
                    <SideBar name="rightThrottle" />
                </ThrottleProvider>
            </div>
        </main>
    )
}