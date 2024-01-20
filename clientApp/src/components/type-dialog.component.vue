<template>
	<v-dialog v-model="showTypeDialog" max-width="400" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Customer Type</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add type</v-btn>
		</template>
		<v-card>
			<v-form ref="typeForm" @submit.prevent="saveCustomerType" class="custom-form">
                <v-card-title>
					Customer Type Entry 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closetypeDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-5">Type Name </v-col>
                        <v-col cols="9" class="mb-1">
                            <v-text-field
                                dense
                                v-model="type.name"
                                outlined
                                hide-details
                                autocomplete="off"
                                :rules="[() => !!type.name || 'Enter type name']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-3">Discount (%)</v-col>
                        <v-col cols="9" class="mb-1">
                            <v-text-field
                                dense
                                v-model="type.discount"
                                outlined
                                hide-details
                                autocomplete="off"
                                :rules="[() => !!type.discount || 'Enter discount']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-5">Target Sale </v-col>
                        <v-col cols="9" class="mb-1">
                            <v-text-field
                                dense
                                v-model="type.target"
                                outlined
                                hide-details
                                autocomplete="off"
								:rules="[() => !!type.target || 'Enter target sale']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
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
        type: {
			id: null,
            name: null,
            discount: '',
			target: ''
		},
		showTypeDialog: false,
		loading: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closetypeDialog() {
			this.resetForm();
			setTimeout(() => {
				this.showTypeDialog = false;
			}, 100);
		},

		async saveCustomerType() {
            let isValid = true;
            this.$refs.typeForm.validate();
            this.$refs.typeForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loading = true;

			let isSuccess = await this.$store.dispatch('customer/addType', this.type);
			if(isSuccess) {
				if(this.type.id == null) {
					this.resetForm();
				} else {
					this.closetypeDialog();
				}
			}

			this.loading = false;
        },

		resetForm() {
			this.$refs.typeForm.reset();
			Object.keys(this.type).forEach(key => {
				this.type[key] = null;
            })
            this.$refs.typeForm.resetValidation();
		}
	}
};
</script>

<style>
</style>