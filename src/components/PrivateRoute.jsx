import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import React from "react";

const PrivateRoute = ({ children, role }) => {
    const { isUserAuthenticated, roles, isUserLoading } = useAuth();

    if (isUserLoading) {
        return <Loading>Loading data</Loading>;
    }
    
    if (!isUserAuthenticated || (role && !roles.includes(role))) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;