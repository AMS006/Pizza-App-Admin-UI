import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../store";
const NonAuth = () => {
    const { user } = useAuth();
    const { search } = useLocation();

    if (user !== null) {
        const returnTo = new URLSearchParams(search).get('returnTo') || '/';
        return <Navigate to={returnTo} replace />
    }
    return (
        <Outlet />
    );
}

export default NonAuth
