<template>
	<v-dialog v-model="showCategoryDialog" max-width="400" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Customer Category</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Customer Category</v-btn>
		</template>
		<v-card>
			<v-form ref="categoryForm" @submit.prevent="saveCategory" class="custom-form">
                <v-card-title>
					Customer Category Entry 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeCategoryDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-5">Name </v-col>
                        <v-col cols="9" class="mb-1">
                            <v-text-field
                                dense
                                v-model="category.name"
                                outlined
                                hide-details
                                autocomplete="off"
                                :rules="[() => !!category.name || 'Enter category name']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
				</v-card-text>

				 <v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" height="32" dark type="submit" :loading="loadingCategorySave">Save</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data: () => ({
        category: {
			id: null,
            name: null,
            description: ''
		},
		showCategoryDialog: false,
		loadingCategorySave: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeCategoryDialog() {
			this.resetForm();
			setTimeout(() => {
				this.showCategoryDialog = false;
			}, 100);
		},

		async saveCategory() {
            let isValid = true;
            this.$refs.categoryForm.validate();
            this.$refs.categoryForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loadingCategorySave = true;

			let isSuccess = await this.$store.dispatch('customer_category/saveCategory', this.category);
			if(isSuccess) {
				if(this.category.id == null) {
					this.resetForm();
				} else {
					this.closeCategoryDialog();
				}
			}

			this.loadingCategorySave = false;
        },

		resetForm() {
			this.$refs.categoryForm.reset();
			Object.keys(this.category).forEach(key => {
				this.category[key] = null;
            })
            this.$refs.categoryForm.resetValidation();
		}
	}
};
</script>

<style>
</style>