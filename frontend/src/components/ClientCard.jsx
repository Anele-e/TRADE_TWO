import { useEffect, useState } from 'react';


export default function ClientCard() {
    return (
        <div className='job-card'>
            <div className='job-card-header'>
                <img src="" alt='client-img'
                        className='avatar' />
                <div className='job-card-body'>
                    <h3>Client Name</h3>
                    <p>Location here</p>
                    <p>Contact Info</p>
                    <p>Additional Details</p>
                </div>
            </div>
            <p className='job-budget'>Budget: R-----</p>
            <p className='job-distance'>------- km away</p>
            <button className='apply-btn'>Apply</button>
        </div>
    )
}
