<template>
	<v-app>
		<v-navigation-drawer
			clipped
			app
			width="250"
			class=""
			v-if="drawer"
		>
			<v-treeview
				class="mt-2 aside_tree"
				dense
				color=""
				:items="$store.getters['layout/menuItems']"
				activatable
				open-on-click
				item-key="id"
				:selectable="shortcutEditMode"
				selection-type="independent"
				:item-disabled="shortcutEditMode ? 'locked' : 'none'"
				v-model="shortcutItems"
				return-object
			>
				<template v-slot:label="{ item }">
					<span v-if="item.children"
						><v-icon
							small
							v-if="item.icon && item.locked != undefined"
							:color="item.color"
							class="mr-1"
							>{{ item.icon }}</v-icon
						>
						{{ item.name }}
					</span>
					<router-link :to="item.link" v-else>
						<div>
							<v-icon
								small
								v-if="item.icon && item.locked != undefined"
								:color="item.color"
								class="mr-1"
								>{{ item.icon }}</v-icon
							>
							{{ item.name }}
						</div>
					</router-link>
				</template>
			</v-treeview>
			
		</v-navigation-drawer>

		<v-app-bar
			:elevation="1"
			extended
			clipped-left
			fixed
			app
			class="custom-app-bar"
		>
			<v-container fluid class="py-0 px-1 theme_bg">
				<v-row no-gutters>
					<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
					<v-toolbar-title style="color: #fff;">
						{{ this.$store.getters['companyProfile/company'] != null ? this.$store.getters['companyProfile/company'].company_name : '' }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					
					<v-col cols="auto" class="pa-0 branch_drop" v-if="userType == 'super_admin'">
						<v-menu offset-y color="red">
							<template v-slot:activator="{ on }">
								<v-btn
									text
									dark
									tile 
									small
									height="34"
									v-on="on"
								>
									<v-icon small class="mr-2"
										>mdi-source-branch-sync</v-icon
									>
									<span class="caption">Branches</span>
								</v-btn>
							</template>

							<v-list nav dense>
								<v-list-item v-for="(branch, ind) in $store.getters['branch/branches']" :key="ind">
									<v-list-item-content class="top-menu">
										<v-list-item-title @click.stop="branchId = branch.id;dialog = true">{{ branch.name }}</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-col>
					<v-col cols="auto" class="mt-1 ml-5">
						<span style="color: #fff;padding-right: 15px;padding-top: 10px;">
							{{
								time.toLocaleString("en-US", {
									day: "numeric",
									month: "numeric",
									year: "numeric",
									weekday: "short",
								})
							}}
							{{
								time.toLocaleString("en-US", {
									hour: "numeric",
									minute: "numeric",
									second: "numeric",
									hour12: true,
								})
							}}
						</span>
					
					</v-col>

					<v-col cols="auto" class="pa-0 theme_bg">
						<v-btn height="35" icon @click.stop="rightDrawer = !rightDrawer">
							<v-icon>mdi-account-circle</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>

			<template v-slot:extension>
				<v-container fluid class="pa-0 grey lighten-5">
					<v-row dense class="pl-1 theme_bg">
						<v-col
							cols="auto"
							class="pa-1 pr-0"
							v-for="(item, ind) in shortcutItems"
							:key="ind"
							style="position:relative"
						>
							<div v-if="shortcutEditMode" @click="shortcutRemove(ind)" class="shortcut-close">
								<v-icon>mdi-close</v-icon>
							</div>

							<v-card
								:elevation="1"
								:to="item.link"
								min-width="80px"
							>
								<v-card-text
									align="center"
									class="pa-0 px-1 pt-1"
								>
									<v-icon :color="item.color">{{
										item.icon
									}}</v-icon
									><br />
									<strong style="font-size: 12px">{{
										item.name
									}}</strong>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col cols="auto" class="pa-1 pr-0">
							<v-card
								@click="changeShortcutItems"
								width="78"
								height="50"
								color="grey lighten-2"
								:elevation="1"
							>
								<v-card-text align="center" class="pa-0 pt-3">
									<v-icon
										color="black"
										v-if="shortcutEditMode"
										>mdi-checkbox-marked-circle-outline</v-icon
									>
									<v-icon color="black" v-else
										>mdi-plus-circle-outline</v-icon
									>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>

					<!-- <v-divider></v-divider> -->

					<v-row no-gutters>
						<v-col cols="auto" style="width: 250px">
							<v-card
								dark
								flat
								tile
								color="theme_bg darken-3 d-flex align-center justify-center"
								height="32"
							>
								<span class="subtitle-2 text-truncate" style="width:200px">{{ branchName }}</span>
							</v-card>
						</v-col>

						<v-col cols="auto" style="width: calc(100% - 250px)">
							<v-card
								tile
								dark
								color="grey lighten-4"
								:elevation="1"
								height="32px"
							>
								<v-card-text class="pa-0">
									<v-tabs
										class="open-pages"
										active-class="active-tab"
										light
										background-color="grey lighten-4"
										show-arrows
										height="32px"
									>
										<v-tabs-slider
											color="grey lighten-4"
										></v-tabs-slider>

										<v-tab
											class="pa-0"
											v-for="(page, ind) in openPages"
											:key="ind"
										>
											<v-chip
												:close="
													page.name == 'Dashboard'
														? false
														: true
												"
												label
												dark
												:color="
													page.active
														? page.color
														: 'grey lighten-2 black--text'
												"
												class="my-1 ml-1"
												small
												:to="page.link"
												@click:close="closeTab(ind)"
											>
												{{ camelPad(page.name) }}
											</v-chip>
										</v-tab>
									</v-tabs>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-container>
			</template>
		</v-app-bar>

		<v-navigation-drawer
            v-model="rightDrawer"
            :right="true"
            :hide-overlay="true"
            temporary
            fixed
            light
        >
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar class="mr-5">
                        <v-icon x-large color="primary"
                            >mdi-account-circle</v-icon
                        >
                    </v-list-item-avatar>

					<v-list-item-content>
                        <v-list-item-title>{{ userFullName }}</v-list-item-title>
                        <v-list-item-subtitle>{{ userName }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense nav class="mt-2">
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-account-details</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
						<router-link to="/profile-setting">
                        	<v-list-item-title class="grey--text text--darken-4">Profile Setting</v-list-item-title>
						</router-link>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title  @click="logout">Sign Out</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

		<v-main>
			<v-container fluid class="pa-0 mt-1">
				<v-row>
					<v-col class="py-0">
						<router-view />
					</v-col>
				</v-row>
			</v-container>
		</v-main>

		<!-- <v-footer app dark color="blue-grey darken-4" class="pa-0" height="26px">
			<v-container fluid class="pa-0">
				<v-row>
					<v-col cols="10" class="py-0">
						<marquee direction="left">
							<span class="caption"
								>2022 | Design & Developed By Jakirul Islam</span
							>
						</marquee>
					</v-col>

					<v-col cols="2" class="py-0 pr-0 primary">
						<v-icon small class="mr-1">mdi-account-circle</v-icon>
						<span class="caption">Developed By Md Jakirul Islam</span>
					</v-col>
				</v-row>
			</v-container>
		</v-footer> -->

		<!-- <snackbar></snackbar> -->

		<!-- dialog start-->
		<v-dialog
			v-model="dialog"
			max-width="390"
		>
			<v-card>
				<v-card-title class="text-h5">
					Are you sure to access branch?
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text class="py-8 text-center">
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						dark
						@click="changeBranch"
					>
						Agree
					</v-btn>

					<v-btn
						class="ml-10"
						color="red"
						dark
						@click="dialog = false"
					>
						Disagree
					</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>
		<!-- dialog end-->
	</v-app>
</template>

<script>
import snackbar from '../components/snackbar.component';
import utilities from '../mixins/utility.mixin'

export default {
	mixins: [utilities],

	components: {
		snackbar,
	},

	data() {
		return {
			userFullName: '',
            userName: '',
			time: "",
			rightDrawer: false,
			shortcutEditMode: false,
			drawer: true,
			rightDrawer: false,
			shortcutItems: [],

			openPages: [
				{ name: "Dashboard", link: "/", active: false, color: "brown" },
			],
			branchId: null,
			dialog: false,
			branchName: '',
			userType: ''
		};
	},

	watch: {
		$route(to, from) {
			this.checkPermission(to.link)

			this.$store.getters['layout/menuItems'].forEach((menu) => (menu.show = false));
			this.openPages.forEach((page) => (page.active = false));

			let currentPage = this.openPages.find(
				(page) => page.name == to.name
			);
			if (currentPage == undefined) {
				this.openPages.push({
					name: to.name,
					link: to.path,
					active: true,
					color: to.meta.color,
				});
			} else {
				currentPage.active = true;
			}
		},
	},

	mounted() {
        let jwtToken =  localStorage.getItem('jwtToken')
		if(jwtToken == null || jwtToken == '')  this.$router.push('/login')
    },

	async created() {
		await this.$store.dispatch('branch/getBranches')
		// if (!this.$store.getters['authorized/user']) 
        // await this.$store.dispatch('authorized/getCurrentUser')

		let userData = JSON.parse(localStorage.getItem('userData'))
		this.userFullName = userData.name;
		this.userName = userData.username;
		this.userType = userData.userType;
		this.branchName = userData.branchName;

		await this.$store.dispatch('companyProfile/getCompanyProfile')
        if (userData.userType == 'super_admin' || userData.userType == 'admin') {
            this.$store.getters['layout/menuItems']
        } else {
            let permissions = this.getPermissions()
            let menuItems = this.makeNestedMenu(this.$store.getters['layout/menuItems'], permissions)
			this.$store.commit('layout/setMentItem', menuItems)
        }

        this.checkPermission(this.$route.link)

		setInterval(() => (this.time = new Date()), 1000);

		if (localStorage.getItem("shortcutItems") != null)
			this.shortcutItems = JSON.parse(
				localStorage.getItem("shortcutItems")
			);
	},

	methods: {
		async changeBranch() {
			if(this.branchId == null) return;
			let isSuccess = await this.$store.dispatch('user/branchAccess', {branchId: this.branchId})
			if(isSuccess) {
				this.dialog = false;
				if(this.$route.name != 'Dashboard') {
					this.$router.push({ name: 'Dashboard' })
				} 
				let userData = JSON.parse(localStorage.getItem('userData'))
				this.userFullName = userData.name;
				this.userName = userData.username;
				this.branchName = userData.branchName;
			}
		},
		logout() {
			this.$store.dispatch('authorized/logout')
            this.$router.push('/login');
		},
		closeTab(ind) {
			this.openPages.splice(ind, 1);
			this.$router.push(this.openPages[ind - 1].link);
		},
		changeShortcutItems() {
			this.shortcutEditMode = !this.shortcutEditMode;
			if (!this.shortcutEditMode) {
				let shortcutItems = JSON.stringify(this.shortcutItems);
				localStorage.setItem("shortcutItems", shortcutItems);
			}
		},
		shortcutRemove(index) {
			this.shortcutItems.splice(index, 1);
			let shortcutItems = JSON.stringify(this.shortcutItems);
			localStorage.setItem("shortcutItems", shortcutItems);
		},
		getPermissions() {
            // let user = this.$store.getters['authorized/user']
			let user = JSON.parse(localStorage.getItem('userData'))
            let _permissions = user ? user.permissions : []
			return _permissions;
            // return _permissions ? _permissions.split(',') : []
        },
        checkPermission(toRouteName) {
			let userData = JSON.parse(localStorage.getItem('userData'))
			let userType = userData.userType 
			if (userType == 'super_admin') return
            if (this.$route.name == 'user-profile-setting') return

            if (toRouteName) {
                let permissions = this.getPermissions()
                if (permissions.length) {
                    let hasPermission = permissions.indexOf(toRouteName)
                    if (hasPermission == -1 && this.$route.path != '/')
                    this.$router.push('/')
                }
            }
        },
	},
};
</script>

<style lang="scss" scoped>
.v-toolbar__content .v-btn.v-btn--icon.v-size--default, .v-toolbar__extension .v-btn.v-btn--icon.v-size--default {
	height: 34px !important;
    width: 364x !important;
}
.left-menu {
	.v-treeview-node__root {
		min-height: 36px !important;

		.v-treeview-node__content {
			margin-left: 0px !important;

			.v-treeview-node__prepend {
				margin-right: 0px !important;
			}

			.v-treeview-node__label {
				font-size: 13px !important;
				font-weight: normal !important;
			}
		}
	}
}
.theme--light.v-treeview {
	color: rgb(6 0 0) !important;
}

.open-pages {
	.v-tab {
		text-transform: none !important;
		font-weight: normal !important;
		letter-spacing: normal !important;
		min-width: 50px!important;
	}

	.v-slide-group__next,
	.v-slide-group__prev {
		flex: 0 1 20px !important;
		min-width: 20px !important;
	}
}

.active-tab {
	color: white !important;
}

.shortcut-close {
	position: absolute;
	right: -5px;
	top: 0px;
	background: #FF1E0E;
	border-radius: 50%;
	z-index: 99999;
	cursor: pointer;
	height: 17px;
	width: 17px;
	text-align: center;

	i {
		color: #ffffff !important;
		font-size: 13px !important;
		top: -4px;
	}

	&:hover {
		background: #424242;
		transition: .3s;
	}
}
.v-list {
    padding: 20 !important;
    width: 200px;
    cursor: pointer;
	
}
.top-menu {
	border-bottom: 1px dotted;
    // padding-bottom: 10px;
	padding: 9px 0 !important;
	font-size: 16px !important;
}
// 12px 0 !important
.v-list .v-list-item .v-list-item__content {
	padding: 10px 0 !important;
}

.branch_drop {
	border-radius: 20px;
	overflow: hidden;
}

// .theme--light.v-navigation-drawer {
// 	background: var(--theme_bg);
//   	padding-top: 20px;
// }
.theme--light.v-navigation-drawer * {
  color: #fff !important;
}
.aside_tree .v-icon {
  color: #fff !important;
}
// .v-icon.v-icon.v-icon--link

</style>
