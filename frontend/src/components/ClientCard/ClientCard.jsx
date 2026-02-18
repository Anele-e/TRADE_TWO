import { useEffect, useState } from 'react';
import styles from "./ClientCard.module.css";


export default function ClientCard({ job }) {
    return (
        <div className={styles.jobCard}>
            <div className={styles.jobCardHeader}>
                <img src="" alt='client-img'
                        className={styles.avatar} />
                <h3>{job.customer?.username ?? 'Unknown Client'}</h3>
            </div>
            <div className={styles.jobCardBody}>
                <h3 className={styles.title}>{job.title}</h3>
                <p>{job.description}</p>
                <div>
                    <p className={styles.jobBudget}>Budget: R {job.price}</p>
                    <p>{job.location_address ?? 'Location not specified'}</p>
                    {/* <p className='job-distance'>------- km away</p> */}
                </div>  
                 <button className={styles.applyBtn}>Apply</button> 
                    {/* <p>Contact Info</p> */}      
            </div>
            
        </div>
    )
}
