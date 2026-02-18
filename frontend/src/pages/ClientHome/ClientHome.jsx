import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useState, useCallback } from "react";
import CreateJobRequest from "../../components/CreateJob/CreateJobRequest";
import CardGrid from "../../components/CardGrid";
import WorkerCard from "../../components/WorkerCard";
import styles from "./ClientHome.module.css";
import { getCloseWorkers } from "../../api/apiCalls";


export default function ClientHome({ user }) {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [workersAvailable, setWorkersAvailable] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchWorkers = async () => {
                try{
                    setIsLoading(true);
                    const workers = await getCloseWorkers();
                    setWorkersAvailable(workers);
                }
                catch (e){
                    setError(e.message);
                    console.error('Error fetching jobs:', e);
    
                } finally{
                    setIsLoading(false);
                }
                
            };
            fetchWorkers();
        }, []);

    if (isLoading) return <div>Loading jobs...</div>;
    if (error) return <div>Error: {error}</div>;  


    function handleClick() {
        setShowForm(true);
    }
    
    return (
        <>
            <NavBar /> {/*in nav bar show active requests*/}
            <div className={styles.homeContainer}>
                {user && <h1>Available Workers Near You</h1>}
                {/* Posts job requests here */}
                <div className={styles.buttonP}>

                    <button onClick={handleClick}>(+)</button>
                    <p className={styles.postPara}>Post a job request here: </p>
                </div>
                
                {showForm && <CreateJobRequest onClose={() => setShowForm(false)} />}
                {/* Show available workers here */}
                <CardGrid items={workersAvailable} renderCard={(worker) => (
                    <WorkerCard key={worker.id} worker={worker} />
                )}
                />
                         
            </div>
        </>
    );
}
