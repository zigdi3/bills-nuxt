import { navigateTo, useFetch, useRuntimeConfig, useState } from 'nuxt/app'
import { computed } from 'vue'
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, RolePermissions } from '../types/auth'

const STORAGE_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Role-based permissions mapping
const rolePermissions: RolePermissions = {
    admin: [
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'profiles.view',
        'profiles.manage',
        'settings.view',
        'settings.manage',
    ],
    premium: [
        'users.view',
        'users.create',
        'users.edit',
        'profiles.view',
        'settings.view',
    ],
    free: [
        'users.view',
        'settings.view',
    ],
}

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth_user', () => null)
    const token = useState<string | null>('auth_token', () => null)
    const refreshToken = useState<string | null>('refresh_token', () => null)
    const isLoading = useState<boolean>('auth_loading', () => false)
    const config = useRuntimeConfig()

    const isAuthenticated = computed(() => !!user.value && !!token.value)


    const isLoggedIn = computed(() => !!token.value)

    const setToken = (newToken: string | null) => {
        if (typeof window !== 'undefined') {
            if (newToken) {
                localStorage.setItem(STORAGE_KEY, newToken)
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
        token.value = newToken
    }

    const setRefreshToken = (newRefreshToken: string | null) => {
        if (typeof window !== 'undefined') {
            if (newRefreshToken) {
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
            } else {
                localStorage.removeItem(REFRESH_TOKEN_KEY)
            }
        }
        refreshToken.value = newRefreshToken
    }

    const setUser = (newUser: AuthUser | null) => {
        user.value = newUser;
    }

    const clearAuth = () => {
        setToken(null)
        setRefreshToken(null)
        setUser(null)
    }

    const onResponseError = ({ response }: any) => {
        if (response?.status === 401) {
            clearAuth()
            navigateTo('/login')
        }
    }

    const login = async (payload: LoginPayload) => {
        isLoading.value = true
        try {
            const { data, error } = await useFetch<AuthResponse>('/auth/login', {
                method: 'POST',
                body: payload,
                baseURL: config.public.apiBase as string,
                key: `login-${Date.now()}`, // Prevent caching
            })
            if (error.value) throw error.value
            if (data.value) {
                setToken(data.value.access_token)
                setRefreshToken(data.value.refresh_token)
                await getUser()
            }
            return data.value
        } finally {
            isLoading.value = false
        }
    }

    const register = async (payload: RegisterPayload) => {
        isLoading.value = true
        try {
            const { data, error } = await useFetch<AuthResponse>('/auth/register', {
                method: 'POST',
                body: payload,
                baseURL: config.public.apiBase as string,
                key: `register-${Date.now()}`,
            })
            if (error.value) throw error.value
            return data.value
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        isLoading.value = true
        try {
            await useFetch('/auth/logout', {
                method: 'POST',
                baseURL: config.public.apiBase as string,
                headers: {
                    Authorization: `Bearer ${token.value}`
                },
                key: `logout-${Date.now()}`, // Prevent caching
                onResponseError
            })
        } finally {
            clearAuth()
            isLoading.value = false
        }
    }

    const getUser = async () => {
        isLoading.value = true
        try {
            const { data, error } = await useFetch<AuthUser>('/auth/me', {
                baseURL: config.public.apiBase as string,
                headers: {
                    Authorization: `Bearer ${token.value}`
                },
                key: `me-${Date.now()}`, // Prevent caching
                onResponseError
            })

            if (error.value && error.value.statusCode !== 401) {
                throw error.value
            }

            if (data.value) {
                setUser(data.value)
            }
            return data.value
        } finally {
            isLoading.value = false
        }
    }

    const refreshTokenFx = async () => {
        isLoading.value = true
        try {
            const { data, error } = await useFetch<AuthResponse>('/auth/refresh', {
                method: 'POST',
                body: { refreshToken: refreshToken.value },
                baseURL: config.public.apiBase as string,
                key: `refresh-${Date.now()}`, // Prevent caching
                onResponseError
            })

            if (error.value && error.value.statusCode !== 401) {
                throw error.value
            }

            if (data.value) {
                setToken(data.value.access_token)
                setRefreshToken(data.value.refresh_token)
            }
            return data.value
        } finally {
            isLoading.value = false
        }
    }

    const hasPermission = (permission: string) => {
        if (!user.value) return false
        const userRoles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
        for (const role of userRoles) {
            const permissions = rolePermissions[role] || []
            if (permissions.includes(permission)) {
                return true
            }
        }
        return false
    }

    return {
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated,
        isLoggedIn,
        setToken,
        setRefreshToken,
        setUser,
        clearAuth,
        login,
        register,
        logout,
        getUser,
        refreshAccessToken: refreshTokenFx,
        hasPermission
    }
}