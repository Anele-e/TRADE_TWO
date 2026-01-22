import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Login() {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate("/");
        }
        catch (err) {
            setError("Login failed, Invalid credentials.");
        }
    }

    return (
        <>
            <NavBar />
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleClick}>
                    {error && <p className="error-message">{error}</p>}
                    <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="submit">Login</button>
                    <a href="/forgot-password"><p>forgot password?</p></a>
                    <p>Dont have an account? <a href="/register">Register</a></p>
                </form>
            </div>
        </>
    )

}