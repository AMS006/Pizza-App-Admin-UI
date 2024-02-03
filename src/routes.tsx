import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/login/login";
import Root from "./layouts/Root";
import NonAuth from "./layouts/NonAuth";
import Dashboard from "./layouts/Dashboard";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: 'auth',
                element: <NonAuth />,
                children: [
                    { path: 'login', element: <LoginPage /> }
                ]
            },
            {
                path: '',
                element: <Dashboard />,
                children: [
                    { path: '', element: <Homepage /> }
                ]
            }
        ]
    }
])