import { useState } from "react";
import "../App.css";
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
                    <>
                        <a href="/me" className="navbar-link">
                            <span className="navbar-profile">Profile</span>
                        </a>
                        <span onClick={logout} className="navbar-button">Logout</span>
                    </>
                )}
                
                <a href="#" className="navbar-link">
                    <span className="navbar-help">Help</span>
                </a>
                <div className="dropdown">
                    <button className="dropbtn" onClick={() => setIsOpen(!isOpen)}>
                        About ▼
                    </button>
                
                {isOpen && (
                    <div className="dropdown-content">
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact</a>
                        <a href="/faq">FAQ</a>
                        <a href="/team">Our Team</a>
                    </div>
                )}
                </div>
            </div>
        </nav>
    );
}
