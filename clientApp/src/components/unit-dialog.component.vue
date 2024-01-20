<template>
	<v-dialog v-model="showUnitDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Unit</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Unit</v-btn>
		</template>
		<v-card>
			<v-form ref="unitForm" @submit.prevent="saveUnit">
                <v-card-title>
					Unit Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeUnitDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="unit.name"
						outlined
						autocomplete="off"
						:rules="[() => !!unit.name || 'Enter unit name']"
					></v-text-field>
				</v-card-text>

				 <v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" height="32" dark type="submit" :loading="loadingUnitSave">Save</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data: () => ({
        unit: {
			id: null,
            name: null
		},
		showUnitDialog: false,
		loadingUnitSave: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeUnitDialog() {
			this.resetUnit();
			setTimeout(() => {
				this.showUnitDialog = false;
			}, 100);
		},

		async saveUnit() {
            let isValid = true;
            this.$refs.unitForm.validate();
            this.$refs.unitForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loadingUnitSave = true;

			let isSuccess = await this.$store.dispatch('unit/saveUnit', this.unit);
			if(isSuccess) {
				if(this.unit.id == null) {
					this.resetUnit();
				} else {
					this.closeUnitDialog();
				}
			}

			this.loadingUnitSave = false;
        },

		resetUnit() {
			this.$refs.unitForm.reset();
			Object.keys(this.unit).forEach(key => {
				this.unit[key] = null;
            })
            this.$refs.unitForm.resetValidation();
		}
	}
};
</script>

<style>
</style>