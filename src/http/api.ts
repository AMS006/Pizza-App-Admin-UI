import { api } from "./client"

export const login = async (credentials: Credentials) => {
    return (await api.post('/auth/login', credentials)).data;
}

export const self = async () => {
    return (await api.get('/auth/self')).data;
}

export const logoutUser = async () => {
    return api.post('/auth/logout');
}

export const getAllUsers = async (query: string) => {
    return api.get(`/users?${query}`);
}

export const getAllTenants = async (query: string) => {
    return api.get(`/tenants?${query}`);
}

export const createUser = async (user: User) => {
    return api.post('/users', user);
}

export const createTenant = async (tenant: Tenant) => {
    return api.post('/tenants', tenant);
}
