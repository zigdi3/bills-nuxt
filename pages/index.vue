<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 100%; max-width: 500px;">
            <h2 class="text-h5 q-mb-md">Dashboard</h2>
            <p v-if="auth.user.value">Welcome, {{ auth.user.value.email }}! You are logged in.</p>
            <q-btn color="negative" label="Logout" @click="auth.logout" :loading="auth.isLoading" class="q-mt-md" />
        </div>
    </q-page>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';

const auth = useAuth()
</script>