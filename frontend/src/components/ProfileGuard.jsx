import { Navigate, useLocation } from "react-router-dom";

export default function ProfileGuard({ children }) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = localStorage.getItem("role");
    const location = useLocation();

    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    
    if (role !== "user") {
        return children;
    }

    
    if (!user.isProfileComplete) {
        
        if (location.pathname !== "/create") {
            return <Navigate to="/create" replace />;
        }
    } else {
        
        
        
        
        
        
        if (location.pathname === "/create") {
            return <Navigate to="/recommend" replace />;
        }
    }

    return children;
}
