import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi, getMe } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async ({ username, password }) => {
        const data = await loginApi({ username, password });
        setToken(data.token);
        localStorage.setItem("token", data.token);
        const userData = await getMe();
        setUser(userData);

    }

    const register = async ({ username, email, first_name, last_name, role, password }) => {
        const data = await registerApi({ username, email, first_name, last_name, role, password });
        setToken(data.token);
        localStorage.setItem("token", data.token);
        const userData = await getMe();
        setUser(userData);
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    }

    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const data = await getMe();
            setUser(data);
        } catch {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");

        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    loadUser();
  }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout, register, setUser, user, loading }}>
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