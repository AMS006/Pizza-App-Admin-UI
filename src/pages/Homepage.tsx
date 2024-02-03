import { useMutation } from "@tanstack/react-query";
import { Button } from "antd"
import { logoutUser } from "../http/api";
import { useAuth } from "../store";

const Homepage = () => {
    const { logout } = useAuth();
    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logoutUser,
        onSuccess: () => {
            logout();
        }
    });

    return (
        <div>
            <h2>Home Page</h2>
            <Button type="primary" onClick={() => mutate()}>Logout</Button>
        </div>
    )
}

export default Homepage
