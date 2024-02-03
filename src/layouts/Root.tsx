import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom"
import { self } from "../http/api";
import { useEffect } from "react";
import { useAuth } from "../store";

const Root = () => {
    const { setUser } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: self,

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
