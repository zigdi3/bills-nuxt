import axios from 'axios'
import { defineNuxtPlugin, navigateTo, useRuntimeConfig } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const auth = useAuth()

    const api = axios.create({
        baseURL: config.public.apiBase as string,
        timeout: 10000
    })

    api.interceptors.request.use((config) => {
        const token = auth.token.value
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                auth.clearAuth()
                navigateTo('/login')
            }
            return Promise.reject(error)
        }
    )

    return {
        provide: {
            axios: api
        }
    }
})