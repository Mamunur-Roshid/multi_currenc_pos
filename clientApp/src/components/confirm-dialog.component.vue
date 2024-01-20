<template>
	<v-dialog v-model="dialog" max-width="320" light>
		<v-card class="text-center">
			<div class="pt-5">
				<v-icon 
					x-large 
					color="red"
					dark
					class="cust-icon"
				>
					mdi-alert
				</v-icon>
			</div>
			<v-card-title class="justify-center py-0">
				<h4>Confirmation !</h4>
			</v-card-title>

			<v-card-text class="py-0">Are you sure to {{text}}?</v-card-text>

			<v-card-actions class="justify-center">
				<v-btn color="primary" dark @click="$emit('confirm')">Yes</v-btn>
				<v-btn color="error" dark @click="dialog = false">No</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
			text: 'delete'
        }
    }
};
</script>

<style>
.cust-icon {
	font-size: 40px;
    border: 3px solid;
    padding: 12px;
    border-radius: 50%;
}
</style>
