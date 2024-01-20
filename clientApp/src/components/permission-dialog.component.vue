<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            scrollable
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title color="primary">
                    User Access Permissions 
                    <v-spacer></v-spacer>
                    <v-btn
                        dark
                        icon
                        color="error" 
                        @click="dialog = false"
                    >
                        X
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height:400px;">
                    <v-container>
                        <v-treeview 
                            selectable
                            :items="$store.getters['layout/menuItems']" 
                            item-key="name"
                            item-val="name"
                            open-all
                            selection-type="independent"
                            return-object
                            v-model="permissions"
                            item-disabled="locked"
                        >
                            <template v-slot:label="{ item }">
                                <!-- <div v-if="item.icon_type == 'svg'">
                                    <img :src="item.icon" alt="A" style="max-width: 25px;max-height: 25px;">
                                </div>
                                <v-icon v-else>
                                    {{ item.icon }}
                                </v-icon> -->
                                <!-- <v-icon
                                    small
                                    v-if="item.icon"
                                    :color="item.color"
                                    class="mr-1"
                                >
                                    {{ item.icon }}
                                </v-icon> -->
                                {{ item.name }}
                            </template>
                        </v-treeview>
                    </v-container>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        dark
                        :loading="loading"
                        @click="saveUserPermissions"
                        class="mr-3"
                    >
                        Save Permission
                    </v-btn>
                </v-card-actions>       
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    props: ["user"],

    data: () => ({
        dialog: false,
        permissions: [],
        loading: false,
    }),

    watch: {
        user(user) {
            if (user == null) return

            let permissions = JSON.parse(user.permissions)

            if (permissions != null) this.permissions = permissions
            else this.permissions = []
        }
    },

    methods: {
        async saveUserPermissions() {
            this.loading = true
            let data = {
                permissions: this.permissions, 
                id: this.user.id
            }

            let res = await this.$store.dispatch('user/userPermission', data)
            if (res) {
                this.dialog = false
            }

            this.loading = false
            this.permissions = []
        }
    },
  }
</script>

<style lang="scss" scoped>
   
</style>