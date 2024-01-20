<template>
	<v-dialog v-model="showBrandDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Brand</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Brand</v-btn>
		</template>
		<v-card>
			<v-form ref="brandForm" @submit.prevent="saveBrand">
                <v-card-title>
					Brand Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeBrandDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="brand.name"
						outlined
						autocomplete="off"
						:rules="[() => !!brand.name || 'Enter brand name']"
					></v-text-field>
				</v-card-text>

				 <v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" height="32" dark type="submit" :loading="loadingBrandSave">Save</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data: () => ({
        brand: {
			id: null,
            name: null
		},
		showBrandDialog: false,
		loadingBrandSave: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeBrandDialog() {
			this.resetBrand();
			setTimeout(() => {
				this.showBrandDialog = false;
			}, 100);
		},

		async saveBrand() {
            let isValid = true;
            this.$refs.brandForm.validate();
            this.$refs.brandForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loadingBrandSave = true;

			let isSuccess = await this.$store.dispatch('brand/saveBrand', this.brand);
			if(isSuccess) {
				if(this.brand.id == null) {
					this.resetBrand();
				} else {
					this.closeBrandDialog();
				}
			}

			this.loadingBrandSave = false;
        },

		resetBrand() {
			this.$refs.brandForm.reset();
			Object.keys(this.brand).forEach(key => {
				this.brand[key] = null;
            })
            this.$refs.brandForm.resetValidation();
		}
	}
};
</script>

<style>
</style>