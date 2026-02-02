import NavBar from "../components/NavBar";
import { useEffect, useState, useCallback } from "react";
// import AvailableWorkers from "../components/AvailableWorkers";
import CreateJobRequest from "../components/CreateJobRequest";


export default function ClientHome({ user }) {
    const [showForm, setShowForm] = useState(false);

    function handleClick() {
        setShowForm(true);
    }
    
    return (
        <>
            <NavBar /> {/*in nav bar show active requests*/}
            <div className="home-container">
                {user && <h1>Welcome, {user.username}!</h1>}
                {/* Posts job requests here */}
                <p>Post a job request here: </p>
                <button onClick={handleClick}>(+)</button>
                {showForm && <CreateJobRequest onClose={() => setShowForm(false)} />}
                {/* Show available workers here */}
                         
            </div>
        </>
    );
}
