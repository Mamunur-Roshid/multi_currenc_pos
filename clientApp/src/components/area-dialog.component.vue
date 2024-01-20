<template>
	<v-dialog v-model="showAreaDialog" max-width="300" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed class="text_bg_fave" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Area</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Area</v-btn>
		</template>
		<v-card>
			<v-form ref="areaForm" @submit.prevent="saveArea">
                <v-card-title>
					Area Name 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeAreaDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
					<v-text-field
						dense
						v-model="area.name"
						outlined
						autocomplete="off"
						:rules="[() => !!area.name || 'Enter area name']"
					></v-text-field>
				</v-card-text>

				 <v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" height="32" dark type="submit" :loading="loadingAreaSave">Save</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
    data: () => ({
        area: {
			id: null,
            name: null
		},
		showAreaDialog: false,
		loadingAreaSave: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeAreaDialog() {
			this.resetArea();
			setTimeout(() => {
				this.showAreaDialog = false;
			}, 100);
		},

		async saveArea() {
            let isValid = true;
            this.$refs.areaForm.validate();
            this.$refs.areaForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loadingAreaSave = true;

			let isSuccess = await this.$store.dispatch('area/saveArea', this.area);
			if(isSuccess) {
				if(this.area.id == null) {
					this.resetArea();
				} else {
					this.closeAreaDialog();
				}
			}

			this.loadingAreaSave = false;
        },

		resetArea() {
			this.$refs.areaForm.reset();
			Object.keys(this.area).forEach(key => {
				this.area[key] = null;
            })
            this.$refs.areaForm.resetValidation();
		}
	}
};
</script>

<style>
</style>