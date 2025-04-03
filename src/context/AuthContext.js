import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true); 
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const queryClient = useQueryClient();
    
    const updateUser = (newUserData) => {
        setUser((prevUser) => ({ ...prevUser, ...newUserData }));
    };
    
    const cleanUrl = () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const fetchToken = async () => {
        
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");

        if (urlToken) {
            localStorage.setItem("authToken", urlToken);
            cleanUrl();
            return urlToken;
        }

        return localStorage.getItem("authToken"); //authToken || null
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
            console.error("Failed to fetch user", error);
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
                toast.warning("Session expired, logging out...");
            } else {
                toast.error("Logout failed. Please try again.");
                console.error("Logout error:", error);
            }
        } finally {
            localStorage.removeItem("authToken");
            setAuthToken(null)
            setUser(null);
            setIsUserLoading(false);
            queryClient.clear();
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

    const isUserAuthenticated = !!user;
    const isAdmin = roles.includes("admin");

    return (
        <AuthContext.Provider value={{ isUserAuthenticated, user, updateUser, logout, isUserLoading, authToken, isAdmin, roles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
