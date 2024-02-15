import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../store";
const NonAuth = () => {
    const { user } = useAuth();

    if (user !== null) {
        return <Navigate to="/" replace />
    }
    return (
        <Outlet />
    );
}

export default NonAuth
