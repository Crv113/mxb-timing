import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
    const { user, roles } = useAuth();

    if (!user || (role && !roles.includes(role))) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;