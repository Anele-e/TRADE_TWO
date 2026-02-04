import { useEffect, useState } from 'react';
import { createJobRequest} from '../api/apiCalls';


const LOCATION_KEY = import.meta.env.VITE_LOCATION_KEY;

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
        console.log('searchAddress called with:', query);
        if(query.length < 3) return;

        try {
            const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${LOCATION_KEY}&q=${encodeURIComponent(query)}`);
        
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error('Location search failed', err);
        }
    }

    const selectSuggestion = (item) => {
        setFormData(prev => ({
            ...prev,
            location_address: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon)
        }));
        setSuggestions([]);
    };


    

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev=> ({...prev, [name]: value}));

        if (name === 'location_address') {
            searchAddress(value);
        }
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
                worker_id: null,
                price: parseFloat(formData.price),
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
                                onChange={handleChange}
                                    required
                                     />
                                {suggestions.length > 0 && (
                                    <ul className='suggestions'>
                                        {suggestions.map((item, index) => (
                                            <li key={index} onClick={() => selectSuggestion(item)}>
                                                {item.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
