import ClientCard from "../components/ClientCard";
import NavBar from "../components/NavBar";

export default function WorkerHome( {user}) {
    return (
        <>
            <NavBar />
            <div className="home-container">
                <h1>Welcome, {user.username}!</h1>
                {/* Show worker-specific content here. */}
                {/* Available Jobs, Assigned Tasks, etc.             */}
            </div>
        </>
    )

}