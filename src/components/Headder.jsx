
import { useAuth } from "../context/AuthContext"

export function Headder({ boatName, boatID }){
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return(
        <header>
            <nav>
                <div>
                    <h1>Boat-Control</h1>
                    {boatName && boatID && (
                        <h3 style={{ fontWeight: 400, opacity: 0.8 }}>
                            {boatName} ({boatID})
                        </h3>
                    )}
                </div>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        background: 'var(--surface)',
                        color: 'var(--text-h)',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Sign Out
                </button>
            </nav>
        </header>
    )
}