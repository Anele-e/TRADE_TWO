import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

export default function Home() {
    const { user, logout } = useAuth();

    if (!user) {
        return (<div>Loading...</div>)
    }

    return (
        <>
            <NavBar />
            <div className="home-container">
                <h1>Welcome, {user.username}!</h1>            
            </div>
        </>
    )
}