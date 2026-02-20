import { useEffect, useState } from "react";
import styles from "./WorkerCard.module.css"
import { getWorkersInfo } from "../../api/apiCalls";



export default function WorkerCard({ worker }) {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    const parsedSkills =
    typeof worker.skills === "string"
        ? worker.skills
            .replace(/[{}"]/g, "")
            .split(",")
        : worker.skills;

    console.log(parsedSkills);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getWorkersInfo(worker.user_id);
                setUserData(data);
                
            }
            catch (e) {
                setError(e.message);
                console.error('Error fetching worker data:', e);
            }
        };
        if (worker?.user_id) {
            fetchUserData();
        }
    },
    [worker.user_id]);

    if (error) return <p>Error Loading Profile</p>

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.avatarSection}>
                    {/* <div className={styles.avatar}>
                        <img
                            src={userData.username}
                            alt={userData.}
                            style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                        />
                    </div> */}
                </div>  
                    <div className={styles.userInfo}>
                        <h4 className={styles.name}>{userData ? userData.username : "Loading..."}</h4>
                        <p className={styles.rating}>
                            ⭐ {worker.rating?.toFixed(1) || "No rating"}
                        </p>
                       
                    </div>
                
            </div>
            <div className={styles.body}>
                <p className={styles.bio}>
                    {worker.bio || "No available bio"}
                </p>
                <div className={styles.skillsContainer}>
                    {parsedSkills?.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
           
        </div>
    )
}
