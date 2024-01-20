<template>
	<v-dialog v-model="showDesignationDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Designation</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Designation</v-btn>
		</template>
		<v-card>
			<v-form ref="designationForm" @submit.prevent="saveDesignation">
                <v-card-title>
					Designation Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeDesinationDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="designation.name"
						outlined
						autocomplete="off"
						:rules="[() => !!designation.name || 'Enter designation name']"
					></v-text-field>
				</v-card-text>

				 <v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" height="32" dark type="submit" :loading="loading">Save</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data: () => ({
        designation: {
			id: null,
            name: null
		},
		showDesignationDialog: false,
		loading: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeDesinationDialog() {
			this.resetDesignation();
			setTimeout(() => {
				this.showDesignationDialog = false;
			}, 100);
		},

		async saveDesignation() {
            let isValid = true;
            this.$refs.designationForm.validate();
            this.$refs.designationForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loading = true;

			let isSuccess = await this.$store.dispatch('designation/saveDesignation', this.designation);
			if(isSuccess) {
				if(this.designation.id == null) {
					this.resetDesignation();
				} else {
					this.closeDesinationDialog();
				}
			}

			this.loading = false;
        },

		resetDesignation() {
			this.$refs.designationForm.reset();
			Object.keys(this.designation).forEach(key => {
				this.designation[key] = null;
            })
            this.$refs.designationForm.resetValidation();
		}
	}
};
</script>

<style>
</style>