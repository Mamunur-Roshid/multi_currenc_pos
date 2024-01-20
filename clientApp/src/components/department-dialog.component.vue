<template>
	<v-dialog v-model="showDepartmentDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Department</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Department</v-btn>
		</template>
		<v-card>
			<v-form ref="departmentForm" @submit.prevent="saveDepartment">
                <v-card-title>
					Department Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeDepartmentDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="department.name"
						outlined
						autocomplete="off"
						:rules="[() => !!department.name || 'Enter department name']"
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
        department: {
			id: null,
            name: null
		},
		showDepartmentDialog: false,
		loading: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeDepartmentDialog() {
			this.resetdepartment();
			setTimeout(() => {
				this.showDepartmentDialog = false;
			}, 100);
		},

		async saveDepartment() {
            let isValid = true;
            this.$refs.departmentForm.validate();
            this.$refs.departmentForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loading = true;

			let isSuccess = await this.$store.dispatch('department/saveDepartment', this.department);
			if(isSuccess) {
				if(this.department.id == null) {
					this.resetdepartment();
				} else {
					this.closeDepartmentDialog();
				}
			}

			this.loading = false;
        },

		resetdepartment() {
			this.$refs.departmentForm.reset();
			Object.keys(this.department).forEach(key => {
				this.department[key] = null;
            })
            this.$refs.departmentForm.resetValidation();
		}
	}
};
</script>

<style>
</style>