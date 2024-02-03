import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store';

const Dashboard = () => {
    const { user } = useAuth();

    if (user === null)
        return <Navigate to="/auth/login" replace />

    return (
        <Outlet />
    )
}

export default Dashboard
