<template>
  <v-app :theme="theme">
    
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <router-link v-ripple to="/" class="d-flex justify-center pt-2" style="padding-bottom: 14px;">
          <!-- <img :src="zealtech_logo" alt="ZEALTECH POS" height="50" /> -->
          <div style="height: 50px;display: flex;justify-content: center;align-items: center;color: #fff;font-size: 25px;">
            ZEALTECH POS
          </div>
        </router-link>
      </v-list>
      <v-divider></v-divider>
       
      <v-treeview
        v-model="tree"
        :open="initiallyOpen"
        :items="$store.getters['layout/menuItems']"
        item-key="id"
        class="px-3 py-5"
        :item-disabled="shortcutEditMode ? 'locked' : 'none'"
        hoverable
        activatable
        transition
        color="#000"
        dark
        open-on-click
      > 
        <template slot="label" slot-scope="props">
              <router-link :to="props.item.link" v-if="props.item.link && props.item.link !== ''">{{ props.item.name }}</router-link>
              <span v-else>{{ props.item.name }}</span>
        </template>
        <template v-slot:prepend="{ item }">
          <div v-if="item.icon_type == 'svg'">
            <img :src="item.icon" alt="A" style="max-width: 25px;max-height: 25px;">
          </div>
          <v-icon v-else>
            {{ item.icon }}
          </v-icon>
        </template>
      </v-treeview>
      <div class="pa-2" v-if="userType == 'super_admin'">
        <v-row style="display: flex;align-items: center;color: #fff; position: relative;">
          <v-col cols="4">
            <div style="padding-left: 5px;position: absolute;top: 20px;">1 USD = </div>
          </v-col>
          <v-col cols="8">
            <div>
              <v-text-field
                dense
                outlined
                hide-details
                label="SRD"
                v-model="company.dolor_rate"
                dark
              ></v-text-field>
            </div>
            <div style="display: flex;justify-content: end;margin-top: 5px;">
              <v-btn @click="saveDolorRate" small color="teal" dark :loading="companySaveLoading">Save</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12">
          </v-col>
        </v-row>
      </div>
    </v-navigation-drawer>
     

    <v-app-bar :elevation="0" extended app class="custom-app-bar ml-auto">
      <v-container fluid class="py-4 px-2 px-1 top_nav">
        <v-row no-gutters> 
          <div class="top_toggle_group">
            <button
              v-ripple
              class="appbar_toggle_btn"
              @click.stop="drawer = !drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <v-toolbar-title class="top_toggle_title">
              {{
                this.$store.getters["companyProfile/company"] != null
                  ? this.$store.getters["companyProfile/company"].company_name
                  : ""
              }}
            </v-toolbar-title>
          </div>
          <v-spacer>
            <div style="display: flex;justify-content: center;height: 100%;align-items: center;">
              <v-btn @click="showAttendance=true" color="primary" dark>
                Attendance
              </v-btn>
            </div>
          </v-spacer>

          <v-col
            cols="auto"
            class="pa-0 branch_drop"
            v-if="userType == 'super_admin'"
          >
            <v-menu offset-y color="red">
              <template v-slot:activator="{ on }">
                <v-btn height="40" v-on="on" class="branch_d">
                  <v-icon small class="mr-2">mdi-source-branch-sync</v-icon>
                  <span class="caption">{{ branchName }}</span>
                </v-btn>
              </template>

              <v-list nav>
                <v-list-item
                  v-for="(branch, ind) in $store.getters['branch/branches']"
                  :key="ind"
                >
                  <v-list-item-content class="top-menu">
                    <v-list-item-title
                      @click.stop="
                        branchId = branch.id;
                        dialog = true;
                      "
                      >{{ branch.name }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col
            cols="auto"
            class="pa-0 branch_drop"
            v-else
          >
            <v-btn color="theme" :elevation="0">
              <span class="caption">{{ branchName }}</span>
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-5 nav_clock">
            <span>
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

          <v-col cols="auto" class="pa-0">
            <v-btn class="u_drower_toggle" @click.stop="rightDrawer = !rightDrawer">
              <!-- <v-icon>mdi-account-circle</v-icon> -->
              <img :src="userIcon" alt="">
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <template v-slot:extension>
        <v-container fluid class="py-0 px-0 grey lighten-5 d-none">
          <v-row dense class="pl-5 pb-3 theme_bg">
            <v-col
              cols="auto"
              class="pa-1 pr-0"
              v-for="(item, ind) in shortcutItems"
              :key="ind"
              style="position: relative"
            >
              <div
                v-if="shortcutEditMode"
                @click="shortcutRemove(ind)"
                class="shortcut-close"
              >
                <v-icon>mdi-close</v-icon>
              </div>

              <v-card :elevation="1" :to="item.link" min-width="80px">
                <v-card-text align="center" class="pa-0 px-1 pt-1">
                  <v-icon :color="item.color">{{ item.icon }}</v-icon
                  ><br />
                  <strong style="font-size: 12px">{{ item.name }}</strong>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="auto" class="pa-1 pr-0">
              <v-card
                @click="changeShortcutItems"
                width="78"
                height="50"
                :elevation="1"
              >
                <v-card-text align="center" class="pa-0 pt-3">
                  <v-icon color="black" v-if="shortcutEditMode"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                  <v-icon color="black" v-else>mdi-plus-circle-outline</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row> 

          <v-row no-gutters style="display: none">
            <v-col cols="auto" style="width: 100%" class="theme_bg">
              <v-card
                class="px-4 bg-white"
                style="border-radius: 0"
                :elevation="1"
              >
                <v-card-text class="pa-0">
                  <v-tabs
                    class="open-pages"
                    active-class="active-tab"
                    show-arrows
                    height="40px"
                  >
                    <v-tabs-slider color="theme_bg"></v-tabs-slider>

                    <v-tab
                      class="pa-0"
                      v-for="(page, ind) in openPages"
                      :key="ind"
                    >
                      <v-chip
                        :close="page.name == 'Dashboard' ? false : true"
                        label
                        :color="
                          page.active // ? page.color
                            ? 'theme_bg'
                            : 'black--text'
                        "
                        class="my-1 ml-1"
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
      style="background: #fff;"
    >
      <template v-slot:prepend>
        <v-list-item two-line style="border-bottom: 1px solid #ddd;">
          <v-list-item-avatar class="mr-5">
            <!-- <v-icon x-large color="primary">mdi-account-circle</v-icon> -->
            <img :src="userIcon" alt="">
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
              <v-list-item-title class="grey--text text--darken-4"
                >Profile Setting</v-list-item-title
              >
            </router-link>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link  @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="padding-top: 70px">
      <v-container fluid class="px-3 py-0 mt-1">
        <v-row>
          <v-col class="py-0">
            <div class="main_container">
              <router-view />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <snackbar></snackbar>

    <!-- dialog start-->
    <v-dialog v-model="dialog" max-width="390">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure to access branch?
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-8 text-center">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="changeBranch"> Agree </v-btn>

          <v-btn class="ml-10" color="red" dark @click="dialog = false">
            Disagree
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- dialog end-->
    <!-- dialog start-->
    <v-dialog v-model="showAttendance" max-width="390">
      <v-card>
        <v-card-title class="text-h5">
          Attendance
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-8 text-center">
          <div class="mb-4">
            <div>
              Employee id
            </div>
            <v-combobox 
                dense
                outlined
                hide-details
                @focus="$store.dispatch('employee/getEmployees')"
                :items="$store.getters['employee/employees']"
                :loading="$store.getters['employee/loadingEmployees']"
                item-text="display_text"
                item-value="id"
                :rules="[(v) => !!v]"
                v-model="employee"
            >
            </v-combobox>
          </div>
          <v-spacer></v-spacer>
          <div style="display: flex;justify-content: space-between;">
            <v-btn color="primary" dark @click="saveAttendancesClockIn">
              Clock in
            </v-btn>
            <v-btn color="danger" dark @click="saveAttendancesClockOut">
              Clock out
            </v-btn>
            <v-btn color="red" dark @click="showAttendance = false">
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- dialog end-->
    

  </v-app>
</template>

<script>
import snackbar from "../components/snackbar.component";
import utilities from "../mixins/utility.mixin";
import zealtech_logo from '../assets/zealtechpos.png';
import contact_popup from '../assets/contact_popup.svg'
import userIcon from '../assets/user-icon.webp'
import axios from 'axios'

export default {
  mixins: [utilities],

  components: {
    snackbar,
  },
  
  data() {
    return {
      userIcon,
      showAttendance: false,
      employeeId: null,
      userFullName: "",
      userName: "",
      time: "",
      zealtech_logo: zealtech_logo,
      rightDrawer: false,
      shortcutEditMode: false,
      drawer: true,
      rightDrawer: false,
      shortcutItems: [],
      company: {
        dolor_rate: 0,
      },
      companySaveLoading: false,

      openPages: [
        { name: "Dashboard", link: "/", active: false, color: "brown" },
      ],
      branchId: null,
      dialog: false,
      tree: [],
      employee: null,
      initiallyOpen: ['a'],
      branchName: "",
      userType: "",
      theme: "dark",
      selectedItem: [],
      cards: ["Today", "Yesterday"],
      // drawer: null,
      rail: false,
      links: [
        ["mdi-inbox-arrow-down", "Inbox"],
        ["mdi-send", "Send"],
        ["mdi-delete", "Trash"],
        ["mdi-alert-octagon", "Spam"],
      ],
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" },
      ],
    };
  },

  watch: {
    employee(employee){
      if (employee == null || employee == '') return;
      this.employeeId = employee.emp_id;
      console.log(this.employeeId);
    },
    $route(to, from) {
      this.checkPermission(to.link);

      this.$store.getters["layout/menuItems"].forEach(
        (menu) => (menu.show = false)
      );
      this.openPages.forEach((page) => (page.active = false));

      let currentPage = this.openPages.find((page) => page.name == to.name);
      if (currentPage == undefined) {
        this.openPages.push({
          name: to.name,
          link: to.path,
          active: true,
          // color: to.meta.color,
          color: "theme_bg",
        });
      } else {
        currentPage.active = true;
      }
    },
  },

  mounted() {
    let jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken == null || jwtToken == "") this.$router.push("/login");

  },

  async created() {
    await this.$store.dispatch("branch/getBranches");
    // if (!this.$store.getters['authorized/user'])
    // await this.$store.dispatch('authorized/getCurrentUser')


    let userData = JSON.parse(localStorage.getItem("userData"));
    this.userFullName = userData.name;
    this.userName = userData.username;
    this.userType = userData.userType;
    this.branchName = userData.branchName;

    await this.$store.dispatch("companyProfile/getCompanyProfile");
    localStorage.setItem('company', JSON.stringify(this.$store.getters['companyProfile/company']))
    this.company.dolor_rate = this.$store.getters['companyProfile/company'].dolor_rate;
    // this.$store.getters['companyProfile/company'].dolor_rate
    if (userData.userType == "super_admin" || userData.userType == "admin") {
      this.$store.getters["layout/menuItems"];
    } else {
      let permissions = this.getPermissions();
      let menuItems = this.makeNestedMenu(
        this.$store.getters["layout/menuItems"],
        permissions
      );
      this.$store.commit("layout/setMentItem", menuItems);
    }

    this.checkPermission(this.$route.link);

    setInterval(() => (this.time = new Date()), 1000);

    if (localStorage.getItem("shortcutItems") != null) {
      this.shortcutItems = JSON.parse(localStorage.getItem("shortcutItems"));
    }
    
  },

  methods: {
    async saveDolorRate() {
      this.companySaveLoading = true;
      await this.$store.dispatch('companyProfile/saveCompanyProfile', { company: this.company })
      this.$store.dispatch('companyProfile/getCompanyProfile')
      this.companySaveLoading = false;
    },
    async saveAttendancesClockIn() {
      if (!this.employeeId) {
        this.$store.dispatch('snackbar/error', 'Employee id is required');
        return;
      }
      // let userData = JSON.parse(localStorage.getItem("userData"));
      // console.log(userData);
      // saveAttendance
      this.$store.dispatch('attendance/saveAttendance', {
        employee_id: this.employeeId,
        type: 'clockin'
      })
      this.employeeId = null;
      this.employee = null;
    },
    async saveAttendancesClockOut() {
      if (!this.employeeId) {
        this.$store.dispatch('snackbar/error', 'Employee id is required');
        return
      }
      this.$store.dispatch('attendance/saveAttendance', {
        employee_id: this.employeeId,
        type: 'clockout'
      })
      this.employeeId = null;
      this.employee = null;
    },

    async changeBranch() {
      if (this.branchId == null) return;
      let isSuccess = await this.$store.dispatch("user/branchAccess", {
        branchId: this.branchId,
      });
      if (isSuccess) {
        this.dialog = false;
        if (this.$route.name != "Dashboard") {
          this.$router.push({ name: "Dashboard" });
        }
        let userData = JSON.parse(localStorage.getItem("userData"));
        this.userFullName = userData.name;
        this.userName = userData.username;
        this.branchName = userData.branchName;
      }
    },
    logout() {
      this.$store.dispatch("authorized/logout");
      this.$router.push("/login");
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
      let user = JSON.parse(localStorage.getItem("userData"));
      let _permissions = user ? user.permissions : [];
      return _permissions;
      // return _permissions ? _permissions.split(',') : []
    },
    checkPermission(toRouteName) {
      let userData = JSON.parse(localStorage.getItem("userData"));
      let userType = userData.userType;
      if (userType == "super_admin") return;
      if (this.$route.name == "user-profile-setting") return;

      if (toRouteName) {
        let permissions = this.getPermissions();
        if (permissions.length) {
          let hasPermission = permissions.indexOf(toRouteName);
          if (hasPermission == -1 && this.$route.path != "/")
            this.$router.push("/");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.svModal .v-dialog {
  border-radius: 0 !important;
}
.s_form {
  margin-top: 10px;
  padding: 10px 10px;
  // border: 1px solid #00AB55;
  border: 1px solid transparent;
  width: 100%;
  color: #000;
  background: #00ab5614;
  border-radius: 2px;
  &::placeholder {
    color: #000;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border: 1px solid #00ab56;
  }
}
.subm_btn {
  background: #00AB55 !important;
  color: #fff !important;
  box-shadow: none !important;
}
.v-toolbar__content .v-btn.v-btn--icon.v-size--default,
.v-toolbar__extension .v-btn.v-btn--icon.v-size--default {
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
    min-width: 50px !important;
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
  background: #ff1e0e;
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
    transition: 0.3s;
  }
}
.v-list {
  //   padding: 20 !important;
  //   width: 200px;
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
  border-radius: 200px !important;
  // overflow: hidden;
}


// .theme--light.v-navigation-drawer {
//   background: var(--theme_bg);
//   padding-top: 20px;
// }
// .theme--light.v-navigation-drawer * {
//   color: #fff !important;
// }
// .aside_tree .v-icon {
//   color: #fff !important;
// }
// .v-icon.v-icon.v-icon--link
</style>
