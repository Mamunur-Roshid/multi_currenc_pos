<template>
    <v-snackbar v-model="$store.getters['snackbar/snackbar'].show" :color="$store.getters['snackbar/snackbar'].color" :right="true">{{ $store.getters['snackbar/snackbar'].text }}</v-snackbar>
</template>

<script>
export default {}
</script>