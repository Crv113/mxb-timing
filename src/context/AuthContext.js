import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {getXsrfHeader} from "../utils/xsrfUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true); 
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const fetchTokenFromBackend = async () => {
        
        try {

            const csrfCookieExists = document.cookie.includes("XSRF-TOKEN");
            
            if(!csrfCookieExists) {
                await fetch(`${process.env.REACT_APP_SEEK_AND_STOCK_URL}/sanctum/csrf-cookie`, {
                    method: "GET",
                    credentials: "include",
                });
            } 
            
            const response = await fetch(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/get-token`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_SEEK_AND_STOCK_API_TOKEN}`,
                }
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("authToken", data.token);
                return data.token;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du token:", error);
        }
        return null;
    };
    
    const fetchUser = async () => {
        setIsUserLoading(true);
        let token = authToken;
        try {
            if(!authToken) {
                token = await fetchTokenFromBackend();
                setAuthToken(token);
            }

            if (token) {
                const userResponse = await fetch(`${process.env.REACT_APP_SEEK_AND_STOCK_API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!userResponse.ok) {
                    console.error("Erreur de récupération utilisateur");
                    return null;
                }

                const userData = await userResponse.json();
                setUser(userData);
            }
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
                    ...getXsrfHeader(),
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
            await fetchUser();
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ user, logout, isUserLoading, authToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
