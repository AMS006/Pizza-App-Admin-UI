import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom"
import { self } from "../http/api";
import { useEffect } from "react";
import { useAuth } from "../store";
import { AxiosError } from "axios";

const Root = () => {
    const { setUser, logout } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: self,
        retry: (failureCount: number, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                logout();
                return false;
            }
            return failureCount < 3;
        }

    });

    useEffect(() => {
        if (data) {
            setUser(data.data);
        }
    }, [data, setUser]);

    if (isLoading)
        return <div>Loading...</div>

    return (
        <Outlet />
    )
}

export default Root
