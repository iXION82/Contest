import { Navigate, useLocation } from "react-router-dom";

export default function ProfileGuard({ children }) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = localStorage.getItem("role");
    const location = useLocation();

    // If no user, let the router or other guards handle it (usually redirect to login)
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If not a user (e.g. company), skip this check
    if (role !== "user") {
        return children;
    }

    // Check if profile is complete
    if (!user.isProfileComplete) {
        // If not complete and not on /create, redirect to /create
        if (location.pathname !== "/create") {
            return <Navigate to="/create" replace />;
        }
    } else {
        // If complete and trying to go to /create, redirect to dashboard/recommend
        // Unless we assume /create is also the "Edit Profile" page, but rq says "not allowed to go to any other page until completed"
        // Usually once completed, they shouldn't see the "Create" form again as a "fresh" form?
        // Let's redirect to /recommend if they try to hit /create again to prevent confusion, 
        // or arguably they might want to edit. But users "are not allowed to go to any other page UNTIL they complete".
        // Implies once complete, they are free. 
        if (location.pathname === "/create") {
            return <Navigate to="/recommend" replace />;
        }
    }

    return children;
}
