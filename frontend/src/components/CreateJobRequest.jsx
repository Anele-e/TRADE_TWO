import { useEffect, useState } from 'react';
import { createJobRequest} from '../api/apiCalls';

export default function CreateJobRequest({ onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location_address: '',
        longitude: null,
        latitude: null
    });
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const searchAddress = async (query) => {
        if(query.length < 3) return;

        const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${LOCATION_KEY}&q=${query}`);
        const data = await res.json();
        setSuggestions(data);
    }


    

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev=> ({...prev, [name]: value}));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.latitude || !formData.longitude) {
            alert("Please select valid location ");
            return
        }
        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                location_address: formData.location_address,
                latitude: formData.latitude,
                longitude: formData.longitude
            }
            await createJobRequest(payload);
            onClose()
        } catch (err) {
            setError(`Job creation failed: ${err.message}`);
            console.error(error)
        }
        finally {
            // Reset form or provide success feedback as needed
            setFormData({
                title: '',
                description: '',
                price: '',
                location_address: ''
            });
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create Job Request</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" name='title'
                        placeholder="Title" value={formData.title}
                        onChange={handleChange} required 
                        />

                    <textarea placeholder="Description"
                        name='description'
                        value={formData.description} 
                        onChange={handleChange} required 
                     />

                    <input type="number"
                        name='price'
                        placeholder="Budget" value={formData.price} 
                        onChange={handleChange} required 
                     />

                    <div className='location-section'>
                        <label>Where is the job?</label>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <input 
                                type='text'
                                name='location_address'
                                placeholder='657 Main Ro...'
                                value={formData.location_address}
                                onChange={(e) => {
                                    setFormData({...prev, location_address: e.target.value});
                                    searchAddress(e.target.value);
                                    }}
                                    required
                                     />
                            {formData.latitude && <small style={{color: 'green'}}>✓ Location Locked</small>}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating../' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}
