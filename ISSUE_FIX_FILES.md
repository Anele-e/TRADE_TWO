# Frontend Issue Fix - Job Request Form Implementation

## Summary
This document contains all files related to implementing the job request form feature in the ClientHome page. The issue was that elements after the h1 weren't rendering until the frontend dev server was properly running.

---

## Files Modified/Created

### 1. ClientHome.jsx
**Path:** `frontend/src/pages/ClientHome.jsx`

```jsx
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
                <p>Post a job request here:</p>
                <button onClick={handleClick}>(+)</button>
                {showForm && <CreateJobRequest onClose={() => setShowForm(false)} />}
                {/* Show available workers here */}          
            </div>
        </>
    );
}
```

**Key Changes:**
- Added state `showForm` to manage modal visibility
- Added `handleClick` function to toggle form visibility
- Conditionally render `CreateJobRequest` component only when `showForm` is true
- Pass `onClose` callback to close the modal

---

### 2. CreateJobRequest.jsx
**Path:** `frontend/src/components/CreateJobRequest.jsx`

```jsx
import { useEffect, useState } from 'react';
import { createJobRequest} from '../api/apiCalls';

export default function CreateJobRequest({ onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location_address: ''
    });
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev=> ({...prev, [name]: value}));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call API to create job request
            const payload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                location_address: formData.location_address
            }
            const job = await createJobRequest(payload);
            onClose()
            setError(null);
            
        } catch (err) {
            setError(`Job creation failed: ${err.message}`);
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

                    <input type="text" 
                        name='location_address'
                        placeholder="Location" value={formData.location_address}
                        onChange={handleChange} required 
                        />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating../' : 'Create Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}
```

**Key Features:**
- Modal form component with controlled inputs
- Form validation with required fields
- Loading and error states
- Form reset after submission
- Close button functionality

---

### 3. apiCalls.js
**Path:** `frontend/src/api/apiCalls.js`

```javascript
import api from "../client";

export const createJobRequest = async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
};
```

**Purpose:** API function to submit job request to backend

---

### 4. App.css (Modal & Home Container Styles)
**Path:** `frontend/src/App.css`

Add these styles to your CSS file:

```css
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  line-height: 20px;
}

.close:hover,
.close:focus {
  color: #000;
}

textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 5px;
  font-family: Arial, sans-serif;
  min-height: 100px;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 10px;
}

.home-container {
  min-height: 500px;
  padding: 20px;
}
```

---

## How to Run

### Start Backend & Frontend with Docker:
```bash
cd C:\Users\DELL\TRADE_TWO
docker compose up
```

### OR Start Backend with Docker + Frontend Dev Server:
```bash
# Terminal 1: Start backend
docker compose up backend postgres

# Terminal 2: Start frontend dev server
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`
Backend API available at: `http://localhost:8000`

---

## Troubleshooting

### Changes not appearing?
- **Hard refresh browser:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Make sure frontend dev server is running:** `npm run dev` in the frontend folder

### Form not submitting?
- Check browser console (F12) for errors
- Ensure backend API is running on port 8000
- Verify the API endpoint `/jobs/` exists in your backend

### Modal not visible?
- Check that `.modal` CSS is in App.css
- Verify z-index conflicts with other elements
- Open DevTools (F12) → Elements → Check for `.modal` in DOM

---

## Testing Checklist

- [ ] Click the `(+)` button to open the form
- [ ] Form modal appears with overlay
- [ ] Fill in all fields: Title, Description, Budget, Location
- [ ] Click "Create Job" button
- [ ] Form submits and closes
- [ ] Check backend logs to verify job was created
- [ ] Close button (X) closes the modal without submitting

