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

export const getAllUsers = async() =>{
    return api.get('/users');
}