<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 100%; max-width: 400px;">
            <h2 class="text-h5 q-mb-md">Sign Up</h2>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input v-model="form.name" label="Name" filled required lazy-rules
                    :rules="[val => !!val || 'Name is required']" />
                <q-input v-model="form.email" label="Email" type="email" filled required lazy-rules
                    :rules="[val => !!val || 'Email is required']" />
                <q-input v-model="form.password" label="Password" type="password" filled required lazy-rules
                    :rules="[val => !!val || 'Password is required']" />
                <div>
                    <q-btn type="submit" color="primary" label="Sign Up" :loading="auth.isLoading.value" />
                    <q-btn flat color="secondary" label="Login" to="/login" class="q-ml-sm" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script setup>
import { navigateTo } from '#app';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
    layout: 'guest',
});

const form = ref({
    name: '',
    email: '',
    password: ''
})

const auth = useAuth()
const $q = useQuasar()

const onSubmit = () => {
    auth.register(form.value)
        .then(() => {
            $q.notify({
                type: 'positive',
                message: 'Registration successful! Please login.'
            })
            navigateTo('/login')
        })
        .catch(error => {
            const message = error.response?._data?.message || 'Sign up failed'
            $q.notify({
                type: 'negative',
                message
            })
        })
}
</script>