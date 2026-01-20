import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async ({ username, password }) => {
        const data = await loginApi({ username, password });
        setToken(data.token);
        localStorage.setItem("token", data.token);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};