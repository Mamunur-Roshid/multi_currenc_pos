<template>
	<v-dialog v-model="showMonthDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Month</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Month</v-btn>
		</template>
		<v-card>
			<v-form ref="monthForm" @submit.prevent="saveMonth">
                <v-card-title>
					Month Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeMonthDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="month.name"
						outlined
						autocomplete="off"
						:rules="[() => !!month.name || 'Enter month name']"
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
        month: {
			id: null,
            name: null
		},
		showMonthDialog: false,
		loading: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeMonthDialog() {
			this.resetMonth();
			setTimeout(() => {
				this.showMonthDialog = false;
			}, 100);
		},

		async saveMonth() {
            let isValid = true;
            this.$refs.monthForm.validate();
            this.$refs.monthForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loading = true;

			let isSuccess = await this.$store.dispatch('month/saveMonth', this.month);
			if(isSuccess) {
				if(this.month.id == null) {
					this.resetMonth();
				} else {
					this.closeMonthDialog();
				}
			}

			this.loading = false;
        },

		resetMonth() {
			this.$refs.monthForm.reset();
			Object.keys(this.month).forEach(key => {
				this.month[key] = null;
            })
            this.$refs.monthForm.resetValidation();
		}
	}
};
</script>

<style>
</style>