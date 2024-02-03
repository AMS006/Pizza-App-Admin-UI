/// <reference types="vite/client" />
type Credentials = {
    email: string;
    password: string;
}

interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
}