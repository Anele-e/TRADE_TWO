import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar/NavBar";
import WorkerHome from "./WorkerHome/WorkerHome";
import ClientHome from "./ClientHome/ClientHome";
import { Navigate } from "react-router-dom";

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (<div>Loading...</div>)
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    switch (user.role) {
        case 'WORKER':
            return <WorkerHome user={user} />;
        case 'CUSTOMER':
            return <ClientHome user={user} />;
        default:
            
    }
    return (
        <>
            <NavBar />
            <div className="home-container">
                <h1>Welcome, {user.username}!</h1>
                <h2>{user.role}</h2>            
            </div>
        </>
    )
}