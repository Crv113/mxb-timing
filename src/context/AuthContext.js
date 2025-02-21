import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true); 
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const updateUser = (newUserData) => {
        setUser((prevUser) => ({ ...prevUser, ...newUserData }));
    };
    
    const fetchToken = async () => {
        
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");

        if (urlToken) {
            localStorage.setItem("authToken", urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
            return urlToken;
        }

        let storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            return storedToken;
        }

        return null;
    };
    
    const fetchUser = async () => {
        setIsUserLoading(true);
        let token = authToken || localStorage.getItem("authToken");

        if (!token) {
            setIsUserLoading(false);
            return;
        }
        
        try {
            const {data: fetchedUser} = await axios.get(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(fetchedUser);
            setRoles(fetchedUser.roles)
        } catch (error) {
            console.error(error);
            await logout(); 
        } finally {
            setIsUserLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/user/logout`, {}, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("Token expired, forcing logout...");
            } else {
                console.error("Logout error:", error);
            }
        } finally {
            localStorage.removeItem("authToken");
            setAuthToken(null)
            setUser(null);
            setIsUserLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const token = await fetchToken();
            if (token) {
                setAuthToken(token);
                await fetchUser();
            }

        })();
    }, []);
    const isAdmin = roles.includes("admin");

    return (
        <AuthContext.Provider value={{ user, updateUser, logout, isUserLoading, authToken, isAdmin, roles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
