/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [boatName, setBoatName] = useState("")
    const [boatID, setBoatID] = useState("")

    const login = (userData, boatInfo) => {
        setUser(userData)
        setBoatName(boatInfo.boatName || "")
        setBoatID(boatInfo.boatID || "")
    }

    const logout = () => {
        setUser(null)
        setBoatName("")
        setBoatID("")
    }

    return (
        <AuthContext.Provider value={{ user, boatName, boatID, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}
