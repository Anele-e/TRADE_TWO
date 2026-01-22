import { useState } from "react";

import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { token, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="logo font-retro font-bold">TRADE.TWO</a>
            </div>
            <div className="navbar-links">
                {token && (
                    <button onClick={logout} className="navbar-button">Logout
                    </button>
                )}
                <a href="/me" className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span className="navbar-profile">Profile</span>
                </a>
            </div>
        </nav>
    );
}
