import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
        }
        catch (err) {
            setError("Login failed, Invalid credentials.");
        }
    }

    return (
    <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleClick}>
            {error && <p className="error-message">{error}</p>}
            <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} />
            <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="submit">Login</button>
        </form>
    </div>
    )

}