export interface AuthUser {
    id: string;
    name: string;
    email: string;
    roles: string | string[];
    profile?: string;
    avatar?: string;
}

export interface RolePermissions {
    [key: string]: string[];
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user?: AuthUser;
}
