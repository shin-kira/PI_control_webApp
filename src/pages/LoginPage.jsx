import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LoginCard } from "../components/LoginCard"

export function LoginPage(){
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleLoginSuccess = (info) => {
        login({}, info)
        navigate("/")
    }

    return(
        <main> 
            <div className="card">
                <LoginCard onLoginSuccess={handleLoginSuccess} />
            </div>
        </main>
    )
}