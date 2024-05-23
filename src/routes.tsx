import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/login/login";
import Root from "./layouts/Root";
import NonAuth from "./layouts/NonAuth";
import Dashboard from "./layouts/Dashboard";
import UsersPage from "./pages/users/users";
import TenantsPage from "./pages/tenants/Tenants";
import ProductsPage from "./pages/products/Products";
import ToppingsPage from "./pages/toppings/Toppings";

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
                    { path: '', element: <Homepage /> },
                    { path: 'users', element: <UsersPage /> },
                    { path: 'restaurants', element: <TenantsPage /> },
                    { path: 'products', element: <ProductsPage /> },
                    { path: 'toppings', element: <ToppingsPage /> }
                ]
            }
        ]
    }
])