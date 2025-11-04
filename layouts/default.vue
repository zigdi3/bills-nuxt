<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Minhas Finanças
        </q-toolbar-title>
        <q-btn v-if="auth.isLoggedIn.value" flat round dense icon="logout" @click="auth.logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';

const auth = useAuth()
</script>
