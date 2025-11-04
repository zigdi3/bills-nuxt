<template>
    <q-page class="flex flex-center">
        <div class="text-center">
            <h1 class="text-h1 text-weight-bold text-primary q-mb-md">You IN!</h1>
            <q-btn color="primary" label="Go to Dashboard" to="/" size="lg" class="q-mt-lg" />
        </div>
    </q-page>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});
</script>

<style scoped>
.text-h1 {
    font-size: 5rem;
}
</style>
