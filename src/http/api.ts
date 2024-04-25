import { api } from "./client"

export const AUTH_SERVICE = '/api/auth';
const CATLOG_SERVICE = '/api/catlog';

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

export const getAllCategories = async () => {
    return api.get(`${CATLOG_SERVICE}/category`);
}

export const getCategory = async (id: string) => {
    return api.get(`${CATLOG_SERVICE}/category/${id}`);
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
