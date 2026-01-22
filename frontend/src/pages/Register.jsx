import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Register() {
    const [formData, setFormData] = useState({username: "", email: "", first_name: "", last_name: "", role: "", password: ""});
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate("/");
        }
        catch (err) {
            setError("Registration failed, Please try again.");
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
                <input type="text" placeholder="Role" onChange={e => setFormData({...formData, role: e.target.value})} />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="submit">Register</button>
            </form>
        </div>
        </>
    )
}
