<script>
import Vue from 'vue';
import { Input, Button, Dialog, Loading } from 'element-ui';
import Validations from 'vuelidate';
import { email, required } from 'vuelidate/lib/validators';
import Logo from '@/components/Logo.vue';

Vue.use(Input);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Validations);
Vue.use(Loading.directive);

const touchMap = new WeakMap();

export default {
    components: {
        Logo
    },

    data: function() {
        return {
            form: {
                email: null
            },
            successDialogVisible: false,
            loading: false
        };
    },

    methods: {
        signIn() {
            return new Promise((resolve, reject) => {
                this.$fireAuth.onAuthStateChanged(user => {
                    if (user) {
                        // User is signed in.
                        // var isAnonymous = user.isAnonymous;
                        // var uid = user.uid;
                        resolve(user);
                    } else {
                        reject(new Error('User does not exist'));
                    }
                });

                this.$fireAuth.signInAnonymously().catch(error => {
                    // let errorCode = error.code;
                    // let errorMessage = error.message;
                    alert(error);
                    reject(error);
                });
            });
        },

        async writeToFirestore() {
            try {
                this.loading = true;

                await this.signIn();

                const messageRef = this.$fireStore
                    .collection('signups')
                    .doc(this.form.email);

                await messageRef.set({
                    created: new Date(),
                    customer: this.form.email
                });

                this.successDialogVisible = true;
                this.form.email = null;
            } catch (e) {
                alert(e);
            }

            this.loading = false;
        },

        delayTouch($v) {
            $v.$reset();

            if (touchMap.has($v)) {
                clearTimeout(touchMap.get($v));
            }

            touchMap.set($v, setTimeout($v.$touch, 1000));
        }
    },

    validations: function() {
        return {
            form: {
                email: { required, email }
            }
        };
    }
};
</script>


<template>
    <section class="container">
        <div class="main-intro" v-loading="loading">
            <header class="tac">
                <logo />
            </header>

            <div class="main-content tac">
                <div class="headline">
                    <div class="title-container">
                        <h1>PSSSSSST!</h1>
                    </div>
                    <div>Hey, gymnast.  We're building an apparel company just for you.</div>
                </div>

                <div class="spacer">
                    <div class="mbs">Sign Up For Your Early Access Invite:</div>

                    <el-input
                        v-model="form.email"
                        :placeholder="$t('Your Email Address')"
                        :class="{ 'inputError': $v.form.email.$error }"
                        @change="delayTouch($v.form.email)" />

                    <div
                        role="alert"
                        v-show="$v.form.email.$dirty"
                        class="colorPink fs14 mbs">
                        <div v-if="!$v.form.email.email">{{ $t('Please enter a valid email address.') }}</div>
                    </div>

                    <div class="mbs fs14">We promise to never spam you.</div>
                </div>

                <div class="spacer">
                    <el-button
                        @click="writeToFirestore"
                        :disabled="$v.form.$invalid">{{ $t('Submit') }}</el-button>
                </div>
            </div>
        </div>

        <div class="main-media">
            <div class="image" style="background-image:url(/images/wieber.jpg)" />
        </div>

        <el-dialog
            :title="$t('You\'re in!')"
            :visible.sync="successDialogVisible"
            :fullscreen="true">
            <span>Want a sticker?</span>
        </el-dialog>
    </section>
</template>


<style lang="scss">
@import '@/assets/css/components/_variables.scss';
@import '@/assets/css/components/_mixins.scss';

.container {
    margin: 0 auto;
    min-height: 100vh;
    @include flexbox();
    @include flex-direction(row);
    @include justify-content(center);
    @include align-items(center);
}

.main-intro {
    background-color: #243051;
    font-size: 20px;
    color: #fff;
    @include flexbox();
    @include flex-direction(column);

    .spacer {
        margin-top: 40px;
    }

    header {
        display: block;
        margin: 40px 50px 50px;
        @include flex-grow(0);

        .gmnstLogo {
            width: 225px;
        }
    }

    .main-content {
        @include flex-grow(1);
        @include flexbox();
        @include flex-direction(column);
        @include justify-content(center);
        margin-top: -125px;
        padding: 50px;
        // @include align-items(center);
        // @include justify-content(center);
        // @include align-items(center);

        .headline {
            // h1 {
            //     font-size: 40px;
            //     font-weight: 600;
            //     margin: 0;
            //     line-height: 50px;
            // }

            h1 {
                position: relative;
                display: block;
                margin: 0;
                font-size: 3rem;
                line-height: 1;
                transform: translateY(6rem);
                animation: up 1500ms linear forwards;
                z-index: 1;
                text-shadow: 0px 1px 1px rgba(255, 255, 255, 1);

                &::before,
                &::after {
                    position: absolute;
                    content: '';
                    width: 0px;
                    height: 1px;
                    left: 0;
                    background-color: rgba(0, 0, 0, 0.2);
                    z-index: -1;
                }

                &::before {
                    top: 1.4rem;
                    animation: draw 1500ms linear 1s forwards;
                }

                &::after {
                    bottom: 0.4rem;
                    animation: draw 1500ms linear 1s forwards;
                }
            }

            .title-container {
                font-size: 0;
                position: relative;
                overflow: hidden;
                padding-bottom: 0.4rem;
            }

            @keyframes up {
                100% {
                    transform: translateY(0);
                }
            }
        }

        .el-button {
            background: rgb(237, 33, 137);
            color: #fff;
            border: 0;
            padding: 15px 30px;
            @include grow();

            &.is-disabled {
                background: rgb(117, 115, 116);
                color: rgb(179, 174, 176);
            }
        }

        .el-button:hover {
            @include growHover();
        }

        input {
            max-width: 400px;
        }
    }
}

.main-intro,
.main-media {
    height: 100vh;
    min-height: 546px;
    position: relative;
    width: 100%;
}

.main-media .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: top center;
    @include background-size(cover);
}

// .inputError input {
//     border-color: red !important;
// }

// @media #{$medium-and-up} {
@media #{$medium-and-down} {
    .container {
        @include flex-direction(column);
    }

    .main-intro {
        font-size: 16px;

        header {
            margin: 20px 0;

            .gmnstLogo {
                width: 200px;
            }
        }

        .main-content {
            padding: 10px;

            .headline {
                line-height: 20px;

                h1 {
                    font-size: 30px;
                    line-height: 35px;
                }
            }
        }
    }
}
</style>
