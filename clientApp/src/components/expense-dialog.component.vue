<template>
	<v-dialog v-model="showExpenseDialog" max-width="400" light>
		<template v-slot:activator="{ on: dialog }" v-if="icon">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn fab x-small depressed color="primary" v-on="{...dialog, ...tooltip}">
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Expense</span>
			</v-tooltip>
		</template>
		<template v-slot:activator="{ on }" v-else>
			<v-btn color="primary" dark v-on="on">Add Expense</v-btn>
		</template>
		<v-card>
			<v-form ref="expenseForm" @submit.prevent="saveExpense" class="custom-form">
                <v-card-title>
					Expense Account Entry 
					<v-spacer></v-spacer>
					<v-btn
						dark
						icon
						color="error" 
						@click="closeExpenseDialog"
					>
						X
					</v-btn>
				</v-card-title>

				<v-divider></v-divider>
				
				<v-card-text>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-5">Exp. Name </v-col>
                        <v-col cols="9" class="mb-1">
                            <v-text-field
                                dense
                                v-model="expense.name"
                                outlined
                                hide-details
                                autocomplete="off"
                                :rules="[() => !!expense.name || 'Enter expense name']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="3" class="text-right pr-5">Description </v-col>
                        <v-col cols="9">
                             <v-textarea
                                dense
                                outlined
                                hide-details
                                v-model.trim="expense.description"
                                height="10vh"
								:rules="[() => !!expense.description || 'Enter expense description']"
                            ></v-textarea>

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
        expense: {
			id: null,
            name: null,
            description: ''
		},
		showExpenseDialog: false,
		loading: false,
	}),

	props: {
		icon: false
	},

	methods: {
		closeExpenseDialog() {
			this.resetForm();
			setTimeout(() => {
				this.showExpenseDialog = false;
			}, 100);
		},

		async saveExpense() {
            let isValid = true;
            this.$refs.expenseForm.validate();
            this.$refs.expenseForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) {
                return;
            }
		
			this.loading = true;

			let isSuccess = await this.$store.dispatch('expense/saveExpense', this.expense);
			if(isSuccess) {
				if(this.expense.id == null) {
					this.resetForm();
				} else {
					this.closeExpenseDialog();
				}
			}

			this.loading = false;
        },

		resetForm() {
			this.$refs.expenseForm.reset();
			Object.keys(this.expense).forEach(key => {
				this.expense[key] = null;
            })
            this.$refs.expenseForm.resetValidation();
		}
	}
};
</script>

<style>
</style>