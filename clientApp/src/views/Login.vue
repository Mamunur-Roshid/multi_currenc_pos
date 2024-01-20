<template>
    <v-app>
       <v-container fluid class="fill-height bg_color" style="z-index:1">
            <div style="width:100%">
                <div class="main_wrap">
                    <div 
                        class="login_wrap"
                    >
                        <div class="head_info">
                            <h2>Zealtech POS</h2>
                            <p>Online inventory management system</p>
                        </div>
                        <v-form ref="loginForm" @submit.prevent="login" class="login_form">
                            <img :src="zealtechpos" class="login_img" />
                            <label class="input_box">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <input type="text" v-model="user.username" name="username" placeholder="Username" autofocus />
                            </label>
                            <label class="input_box">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <input type="password" v-model="user.password" name="password" placeholder="Password" />
                            </label>
                            <button type="submit" class="login_btn">
                                <v-progress-circular v-if="loading" indeterminate color="white" size="25"></v-progress-circular>
                                Log in
                            </button>
                        </v-form>
                        <img :src="welcome_banner" class="welcome_img" />
                    </div>
                </div>
            </div>
        </v-container>
    </v-app>
</template>

<script>
import utilities from '../mixins/utility.mixin'
import welcome_banner from '../assets/welcome_banner.png'
import zealtechpos from '../assets/zealtechpos.png'
export default {
    name: "Login",

    mixins: [utilities],
    data: () => {
        return {
            welcome_banner: welcome_banner,
            zealtechpos: zealtechpos,
            user: {
                username: '',
                password: '',
            },
            loading: false
        }
    },
    
    mounted() {
        let jwtToken = localStorage.getItem('jwtToken')
        if (jwtToken != null && jwtToken != '') this.$router.push('/')
    },

    methods: {
        async login() {
            let isValid = true;

            this.$refs.loginForm.inputs.forEach(input => {
                if(input.hasError) {
                    isValid = false;
                    return;
                }
            })

            if(!isValid) {
                return;
            }

            this.loading = true;
            let isSuccess = await this.$store.dispatch('user/login', this.user);
            if(isSuccess) {
                location.href = '/'
            }
            this.loading = false;
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    margin: 0px;
    padding: 0px;
}
.bg_color {
    background: #f6f6f6;
}
.main_wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 50px;
}
.login_wrap {
    background: #fff;
    padding: 50px !important;
    width: 100vw;
    max-width: 1000px;
    min-height: 630px;
    overflow: hidden;
    border-radius: 20px;
    margin: 0 auto;
    position: relative;
    box-shadow: rgba(145, 158, 171, 0.2) 0px 5px 15px 3px !important;
}
.login_img {
    width: 150px;
    display: block;
    margin: 0 auto;
    margin-bottom: 40px;
}
.welcome_img {
    position: absolute;
    display: block;
    width: 75%;
    right: -5px;
    bottom: -10px;
    z-index: 1;
}

.login_form {
    width: 100% !important;
    max-width: 380px;
    background: #fff;
    box-shadow: rgba(145, 158, 171, 0.2) 0px 5px 15px 3px;
    border-radius: 10px;
    padding: 20px;
    padding-bottom: 100px;
    position: absolute;
    z-index: 10;
    bottom: 50px;
    left: 50px;
}
.head_info {
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    // text-align: center;
    p {
        font-weight: normal;
    }
}
.input_box {
    display: flex;
    margin-bottom: 20px;
    position: relative;
    svg {
        width: 30px;
        height: 30px;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        color: #888;
    }
    input {
        border: 1px solid #ddd;
        flex: 1;
        padding: 10px;
        padding-left: calc(50px);
        outline: none;
        border-radius: 5px;
        &:focus {
            outline: none;
            border-color: #26ab69;
            box-shadow: 0 0 0 1px #26ab69;
        }
    }
}
.login_btn {
    background: #26ab69 !important;
    color: #fff !important;
    padding: 12px 20px !important;
    width: 100%;
    border-radius: 8px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    // text-transform: uppercase;
    font-weight: 600;
    box-shadow: rgba(38, 171, 105, 0.2) 0px 5px 15px 3px;;
}

@media (max-width: 768px) {
    .main_wrap {
        padding: 0;
    }
    .login_wrap {
        box-shadow: none !important;
        border-radius: 0 !important;
        height: 100vh;
        padding: 20px 20px !important;
        // padding-top: 300px;
        .login_form {
            position: relative !important;
            top: 38%;
            left: 50%;
            right: auto;
            bottom: auto;
            transform: translate(-50%, -50%);
            width: 100%;
            // box-shadow: none !important;
            // border-radius: 10px 0 10px 10px !important;
            // background: #dbeee3;
        }
        .head_info {
            text-align: center;
            // display: none;
        }
        .input_box {
            svg {
                color: #26ab69;
            }
            input {
                border-color: #26ab69;
                width: 100%;
            }
        }
        .welcome_img {
            right: 50%;
            top: 60%;
            width: 380px;
            transform: translateY(calc(-50% - 260px)) translateX(50%);
            display: none;
        }
    }
}

.as_admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #26ab6944;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 10px;
    .as_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3px 5px;
        background: #26ab6933;
        color: #26ab69;
        border-radius: 5px;
    }
}
// .area {
//     background: #292961;
//     background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
//     width: 100%;
//     height: 100vh;
//     position: absolute;
//     top: 0;
//     z-index: 0;
// }

// .circles {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     overflow: hidden;
// }

// .circles li {
//     position: absolute;
//     display: block;
//     list-style: none;
//     width: 20px;
//     height: 20px;
//     background: rgba(255, 255, 255, 0.2);
//     animation: animate 25s linear infinite;
//     bottom: -150px;
// }

// .circles li:nth-child(1) {
//     left: 25%;
//     width: 80px;
//     height: 80px;
//     animation-delay: 0s;
// }

// .circles li:nth-child(2) {
//     left: 10%;
//     width: 20px;
//     height: 20px;
//     animation-delay: 2s;
//     animation-duration: 12s;
// }

// .circles li:nth-child(3) {
//     left: 70%;
//     width: 20px;
//     height: 20px;
//     animation-delay: 4s;
// }

// .circles li:nth-child(4) {
//     left: 40%;
//     width: 60px;
//     height: 60px;
//     animation-delay: 0s;
//     animation-duration: 18s;
// }

// .circles li:nth-child(5) {
//     left: 65%;
//     width: 20px;
//     height: 20px;
//     animation-delay: 0s;
// }

// .circles li:nth-child(6) {
//     left: 75%;
//     width: 110px;
//     height: 110px;
//     animation-delay: 3s;
// }

// .circles li:nth-child(7) {
//     left: 35%;
//     width: 150px;
//     height: 150px;
//     animation-delay: 7s;
// }

// .circles li:nth-child(8) {
//     left: 50%;
//     width: 25px;
//     height: 25px;
//     animation-delay: 15s;
//     animation-duration: 45s;
// }

// .circles li:nth-child(9) {
//     left: 20%;
//     width: 15px;
//     height: 15px;
//     animation-delay: 2s;
//     animation-duration: 35s;
// }

// .circles li:nth-child(10) {
//     left: 85%;
//     width: 150px;
//     height: 150px;
//     animation-delay: 0s;
//     animation-duration: 11s;
// }

// @keyframes animate {
//     0% {
//         transform: translateY(0) rotate(0deg);
//         opacity: 1;
//         border-radius: 0;
//     }

//     100% {
//         transform: translateY(-1000px) rotate(720deg);
//         opacity: 0;
//         border-radius: 50%;
//     }
// }
</style>