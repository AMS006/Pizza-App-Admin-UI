import { api } from "./client"

export const AUTH_SERVICE = '/api/auth';
const CATLOG_SERVICE = '/api/catlog';
const ORDER_SERVICE = '/api/order';

export const login = async (credentials: Credentials) => {
    return (await api.post(`${AUTH_SERVICE}/auth/login`, credentials)).data;
}

export const self = async () => {
    return (await api.get(`${AUTH_SERVICE}/auth/self`)).data;
}

export const logoutUser = async () => {
    return api.post(`${AUTH_SERVICE}/auth/logout`);
}

export const getAllUsers = async (query: string) => {
    return api.get(`${AUTH_SERVICE}/users?${query}`);
}

export const getAllTenants = async (query: string) => {
    return api.get(`${AUTH_SERVICE}/tenants?${query}`);
}

export const createUser = async (user: User) => {
    return api.post(`${AUTH_SERVICE}/users`, user);
}


export const updateUser = async (user: User) => {
    return api.patch(`${AUTH_SERVICE}/users/${user.id}`, user);
}

export const deleteUser = async (id: number) => {
    return api.delete(`${AUTH_SERVICE}/users/${id}`);
}

export const createTenant = async (tenant: Tenant) => {
    return api.post(`${AUTH_SERVICE}/tenants`, tenant);
}

export const updateTenant = async (tenant: Tenant) => {
    return api.patch(`${AUTH_SERVICE}/tenants/${tenant.id}`, tenant);
}

export const deleteTenant = async (id: number) => {
    return api.delete(`${AUTH_SERVICE}/tenants/${id}`);
}


// Catlog - service

export const createCategory = async (category: CreateCategory) => {
    return api.post(`${CATLOG_SERVICE}/category`, category);

}

export const updateCategory = async (category: CreateCategory, _id: string) => {
    return api.put(`${CATLOG_SERVICE}/category/${_id}`, category);
}

export const getAllCategories = async (query: string) => {
    return api.get(`${CATLOG_SERVICE}/category?${query}`);
}

export const getCategory = async (id: string) => {
    return api.get(`${CATLOG_SERVICE}/category/${id}`);
}

export const deleteCategory = async (id: string) => {
    return api.delete(`${CATLOG_SERVICE}/category/${id}`);
}

export const getAllProducts = async (query: string) => {
    return api.get(`${CATLOG_SERVICE}/product?${query}`);
}

export const deleteProduct = async (id: string) => {
    return api.delete(`${CATLOG_SERVICE}/product/${id}`);
}

export const createProduct = async (product: FormData) => {
    return api.post(`${CATLOG_SERVICE}/product`, product, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const updateProduct = async (product: FormData, id: string) => {
    return api.put(`${CATLOG_SERVICE}/product/${id}`, product, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const createTopping = async (topping: FormData) => {
    return api.post(`${CATLOG_SERVICE}/topping`, topping, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const updateTopping = async (topping: FormData, id: string) => {
    return api.put(`${CATLOG_SERVICE}/topping/${id}`, topping, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteTopping = async (id: string) => {
    return api.delete(`${CATLOG_SERVICE}/topping/${id}`);
}

export const getAllToppings = async (query: string) => {
    return api.get(`${CATLOG_SERVICE}/topping?${query}`);
}

// Order- Service

export const getAllCoupons = async (query: string) => {
    return api.get(`${ORDER_SERVICE}/coupon?${query}`);
}

export const createCoupon = async (coupon: Coupon) => {
    return api.post(`${ORDER_SERVICE}/coupon`, coupon);
}

export const updateCoupon = async (coupon: Coupon) => {
    return api.put(`${ORDER_SERVICE}/coupon/${coupon._id}`, coupon);
}

export const deleteCoupon = async (id: string) => {
    return api.delete(`${ORDER_SERVICE}/coupon/${id}`);
}

export const getAllOrders = async (query: string) => {
    return api.get(`${ORDER_SERVICE}/order?${query}`);
}

export const getOrder = async (id: string) => {
    return api.get(`${ORDER_SERVICE}/order/details/${id}`);
}

export const confirmOrder = async (id: string) => {
    return api.patch(`${ORDER_SERVICE}/order/confirm/${id}`);
}

export const updateOrderStatus = async (id: string, status: string) => {
    return api.patch(`${ORDER_SERVICE}/order/status/${id}`, { status });
}

export const getTotalOrdersSales = async () => {
    return api.get(`${ORDER_SERVICE}/order/total-order-sale`);
}

export const getRecentOrders = async () => {
    return api.get(`${ORDER_SERVICE}/order/recent-orders`);
}

export const getSalesReport = async () => {
    return api.get(`${ORDER_SERVICE}/order/sales-report`);
}