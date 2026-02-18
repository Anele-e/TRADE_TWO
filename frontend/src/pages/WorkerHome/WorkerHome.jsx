import NavBar from "../../components/NavBar/NavBar";
import CardGrid from "../../components/CardGrid";
import ClientCard from "../../components/ClientCard/ClientCard";
import { useState, useEffect } from "react";
import styles from "./Worker.module.css";
import { useCallback } from "react";
import { getOpenJobs } from "../../api/apiCalls";

export default function WorkerHome( {user}) {
    const [clientWithJobs, setClientWithJobs] = useState([]);
    const [selected, setSelected] = useState([]);
    const [itsLoading, setItsLoading] = useState(true);
    const [error, setError] = useState(null);
    const options = [
  "Door Installer", "Furniture maker", "mechanic", "Bricklayer",
  "Electrician", "Tile setter", "Plumbing", "Gardening"
];

    const toggleOption = (option) => {
        setSelected(prev => 
            prev.includes(option) ? prev.filter(o => o !== option)
            : [...prev, option]
        );
    };
    

    useEffect(() => {
        const fetchJobs = async () => {
            try{
                setItsLoading(true);
                const jobs = await getOpenJobs();
                setClientWithJobs(jobs);
            }
            catch (e){
                setError(e.message);
                console.error('Error fetching jobs:', e);

            } finally{
                setItsLoading(false);
            }
            
        };
        fetchJobs();
    }, []);

    if (itsLoading) return <div>Loading jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <NavBar />
            <div className={styles.homeContainer}>
                <h1 className={styles.title}>Find Your Next Gig!</h1>
                <p className={styles.smallP}>Broswe local job requests and star earning</p>

                <div className={styles.cardDiv}>
                    <h2 className={styles.subTitle}>Available Jobs</h2>
                    <CardGrid items={clientWithJobs} renderCard={(job) => (
                        <ClientCard key={job.id} job={job} />
                    )}
                    />
                </div>
             
                
            </div>
        </>
    )

}