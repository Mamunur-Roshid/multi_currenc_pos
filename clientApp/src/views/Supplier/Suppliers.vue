<template>
    <v-container fluid class="shadow1 rounded pb-4 white">
        <v-row no-gutters>
            <v-col cols="12">
                <v-data-table
                    class="custom-data-table"
					:headers="supplierHeaders"
					:items="$store.getters['supplier/suppliers']"
                    :loading="$store.getters['supplier/loadingSuppliers']"
					:items-per-page="15"
					:search="supplierSearch"
				>
					<template v-slot:top>
						<v-toolbar dense color="white" :elevation="0" class="custom-toolbar mb-2">
							<v-toolbar-title class="subtitle-2">Supplier List</v-toolbar-title>
							<v-divider class="mx-4" inset vertical></v-divider>
                            <v-form class="custom-form"> 
                                <v-text-field v-model="supplierSearch" dense single-line hide-details outlined placeholder="Search supplier" width="400" autocomplete="off" class="table-search" style="width:300px;">
                                    <v-icon slot="append">mdi-magnify</v-icon>
                                </v-text-field> 
                            </v-form>
						</v-toolbar>
					</template>
				</v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: 'Suppliers',

    data: ()=> ({
        supplierHeaders: [
            { text: 'Sl', value: 'sl' },
            { text: 'Supplier Id', value: 'code' },
            { text: 'Name', value: 'student_name' },
            { text: 'Mobile', value: 'phone' },
            { text: 'Org. Name', value: 'org_name' },
            { text: 'Org. Phone', value: 'org_phone' },
            { text: 'Address', value: 'address' },
            { text: 'E-mail', value: 'email' },
            { text: 'Credit Limit', value: 'credit_limit' },
        ],
        supplierSearch: '',
    }),

    async created() {
        await this.$store.dispatch('supplier/getSuppliers')
    },

    methods: {
       
    }
}
</script>

<style lang="scss" scoped>
</style>
