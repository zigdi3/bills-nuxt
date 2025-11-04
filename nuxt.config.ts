import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            title: 'Minha Conta',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ]
        }
    },
    css: [
        '@quasar/extras/roboto-font/roboto-font.css',
        '@quasar/extras/material-icons/material-icons.css',
        'quasar/src/css/index.sass'
    ],
    build: {
        transpile: ['quasar']
    },
    modules: ['nuxt-quasar-ui'],
    quasar: {
        plugins: [
            'Notify'
        ]
    },
    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:3001'
        }
    }
})