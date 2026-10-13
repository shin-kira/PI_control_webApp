import { useState } from "react"
import { UserLogin } from "../firebase/firebaseManager"


export function LoginCard({ onLoginSuccess }){
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(event){
        event.preventDefault()
        setError("")
        setIsLoading(true)

        const formData = new FormData(event.target)
        const username = formData.get("userName")?.trim()
        const password = formData.get("password")?.trim()
        const boatName = formData.get("boatName")?.trim()
        const boatID = formData.get("boatID")?.trim()

        if (!username || !password || !boatName || !boatID) {
            setError("Please fill in all fields.")
            setIsLoading(false)
            return
        }

        try {
            const user = await UserLogin(username, password)
            if (user !== null && onLoginSuccess) {
                onLoginSuccess({ boatName, boatID })
            } else {
                setError("Invalid email or password. Please try again.")
            }
        } catch (err) {
            setError(`Something went wrong. Please try again. (${err.message})`)
        } finally {
            setIsLoading(false)
        }
    }
    return(
        <form className="login-form" onSubmit={handleLogin}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>Welcome Back</h1>
                <p style={{ color: "var(--text)", fontSize: "0.875rem" }}>Sign in to control your boat</p>
            </div>

            {error && (
                <div style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    border: "1px solid #fecaca"
                }}>
                    {error}
                </div>
            )}

            <label>
                Email
                <input 
                    name="userName"
                    type="email"
                    placeholder="you@example.com"
                    required
                />
            </label>

            <label>
                Password
                <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </label>

            <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />

            <label>
                Boat Name
                <input
                    type="text"
                    name="boatName"
                    placeholder="e.g. Scuba"
                    required
                />
            </label>

            <label>
                Boat ID
                <input
                    type="text"
                    name="boatID"
                    placeholder="e.g. 1234"
                    required
                />
            </label>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    )
}