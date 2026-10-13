/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from "react"
import { useBoat } from "./StausBars"

export const ThrottleContext = createContext(null)

export function useThrottle() {
    const context = useContext(ThrottleContext)
    if (!context) {
        throw new Error("useThrottle must be used within ThrottleContext.Provider")
    }
    return context
}

export function ThrottleProvider({ children }) {
    const [throttleValue, setThrottleValue] = useState(0)

    function updateThrottle(value) {
        setThrottleValue(value)
    }

    return (
        <ThrottleContext.Provider value={{ throttleValue, updateThrottle }}>
            {children}
        </ThrottleContext.Provider>
    )
}

export function SideBar(props){
    const { throttleValue, updateThrottle } = useThrottle()
    const { updateThrottle: updateBoatThrottle } = useBoat()
    const valueState = Number(throttleValue) || 0

    function changeSliderValue(valu){
        updateThrottle(valu)
        updateBoatThrottle(props.name, valu)
    }
    return(
        <div className="sidebar-panel">
            <div className="slider-value">{valueState}</div>
            <div className="slider-wrapper">
                <input
                    className="vertical-slider"
                    name={props.name}
                    type="range"
                    min="0"
                    max="100"
                    value={valueState}
                    onChange={(event)=>changeSliderValue(Number(event.target.value))}
                />
            </div>
        </div>
    )
}