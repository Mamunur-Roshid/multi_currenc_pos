<template>
    <v-app>
        <router-view></router-view>
        <snackbar></snackbar>
    </v-app>
</template>

<script>
import snackbar from '../components/snackbar.component';
export default {
    components: {
        snackbar
    }
}
</script>

<style>

</style>