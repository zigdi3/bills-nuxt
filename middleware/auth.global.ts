import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuth } from "../composables/useAuth"

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth()

    if (!auth.isLoggedIn.value && to.path !== '/login' && to.path !== '/signup') {
        return navigateTo('/login')
    }

    if (auth.isLoggedIn.value && (to.path === '/login' || to.path === '/signup')) {
        return navigateTo('/')
    }
})