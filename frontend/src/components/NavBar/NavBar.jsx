import { useEffect, useState } from "react";
// import "../App.css";
import { useAuth } from "../../context/AuthContext";
import styles from "./NavBar.module.css";

export default function NavBar() {
    const { token, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    const onLogOut = () => localStorage.removeItem("token"); 

    return (
        <>
        <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}>
            <div className={styles.logo}>
                TRADE.TWO
            </div>

            <ul className={styles.navbarLinks}>
                <li>
                   <a href="/home">Home</a>
                </li>
                {token ? (
                    <>
                        <li>
                            <a href="/me">
                                Profile
                            </a>
                        </li>
                        <li><a href="/help">Help</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li>
                            <a href="/logout" onClick={onLogOut}>
                                Logout
                            </a>
                        </li>
                    </>
                    ) : (
                        <>
                            <li><a href="/about">About ▼</a></li>
                            <li><a href="/help">Help</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </>
                    )}
                
                
                
        
                
                
                
            </ul>
            <button className={styles.hamburgerButton} onClick={toggleMenu} aria-label="Toggle navigation menu" aria-expanded={isOpen}>
                <span />
                <span />
                <span />
            </button>
        </nav>
        {isOpen && (
            <div className={styles.mobileMenu}>
                <button className={styles.closeButton} onClick={closeMenu} aria-label="Close navigation menu">
                        &times;
                </button>
                <a href="/home" onClick={closeMenu}>Home</a>
                <a href="/about" onClick={closeMenu}>About</a>
                <a href="/help" onClick={closeMenu}>Help</a>
                <a href="/contact" onClick={closeMenu}>Contact</a>
            </div>
        )}
        </>
        )
    }
