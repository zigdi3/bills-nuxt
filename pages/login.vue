<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 100%; max-width: 400px;">
            <h2 class="text-h5 q-mb-md">Login</h2>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input v-model="form.email" label="Email" type="email" filled required lazy-rules
                    :rules="[val => !!val || 'Email is required']" />
                <q-input v-model="form.password" label="Password" type="password" filled required lazy-rules
                    :rules="[val => !!val || 'Password is required']" />
                <div>
                    <q-btn type="submit" color="primary" label="Login" :loading="auth.isLoading.value" />
                    <q-btn flat color="secondary" label="Sign Up" to="/signup" class="q-ml-sm" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script setup>
import { navigateTo } from 'nuxt/app';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

definePageMeta({
    layout: 'guest',
});

const form = ref({
    email: '',
    password: ''
})

const auth = useAuth()
const $q = useQuasar()

const onSubmit = async () => {
    try {
        await auth.login(form.value)
        $q.notify({
            type: 'positive',
            message: 'Login successful!',
            position: 'top'
        })
        await navigateTo('/success')
    } catch (error) {
        const message = error.response?._data?.message || 'Login failed'
        $q.notify({
            type: 'negative',
            message
        })
    }
}
</script>