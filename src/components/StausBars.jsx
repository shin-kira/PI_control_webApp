/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"

export const BoatContext = createContext(null)

export function useBoat() {
    const context = useContext(BoatContext)
    if (!context) {
        throw new Error("useBoat must be used within BoatContext.Provider")
    }
    return context
}

export function StatusBar(props){
    const { driveMode, switchStatus, relStatus, toggleDrive, toggleSwitch, toggleRel } = useBoat()

    const connection = props.connection ?? "waiting..."
    const location = props.location ?? "waiting..."
    const weight =props.weight ?? "waiting..."
    const battery = props.battery ?? "waiting..."

    return(
        <section className="status-card">
            <div className="status-card-sec">
                <h2>Boat: {props.boatName} ({props.boatID})</h2>
            </div>
            <div className="status-card-sec">
                <h2>Connectivity: {connection}</h2>
            </div>
            <div className="status-card-sec">
                <h2>Location: {location}</h2>
            </div>
            <div className="status-card-sec">
                <h2>weight: {weight}</h2>
            </div>
            <div className="status-card-sec">
                <h2>battery percentage: {battery}</h2>
            </div>
            <div className="status-card-actions">
                <div className="status-card-sec">
                    Drive Mode:
                    <button onClick={toggleDrive}>{driveMode}</button>
                </div>
                <div className="status-card-sec">
                    Switch Mode:
                    <button onClick={toggleSwitch}>{switchStatus}</button>
                </div>
                <div className="status-card-sec">
                    Belt Mode:
                    <button onClick={toggleRel}>{relStatus}</button>
                </div>
            </div>
        </section>
    )
}