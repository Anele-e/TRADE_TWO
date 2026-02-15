import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

export default function Register() {
    const [formData, setFormData] = useState({username: "", email: "", first_name: "", last_name: "", role: "", password: ""});
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            if (response.user.role === "WORKER" && !response.user.has_selected_skills) {
                navigate("/skills");
                return;
            }else {
            navigate("/");
            }
        }
        catch (err) {
            setError(`Sorry \n Registration failed: ${err.message}\n Please try again.`);
        }
    }

    return (
        <>
        <NavBar />
         <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleClick}>
                {error && <p className="error-message">{error}</p>}
                <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} />
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="text" placeholder="First Name" onChange={e => setFormData({...formData, first_name: e.target.value})} />
                <input type="text" placeholder="Last Name" onChange={e => setFormData({...formData, last_name: e.target.value})} />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                <select placeholder="Role" onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="">Select a Role</option>
                    <option value="WORKER">WORKER</option>
                    <option value="CUSTOMER">CLIENT</option>
                </select>
                
                <button type="submit">Register</button>
            </form>
        </div>
        </>
    )
}
