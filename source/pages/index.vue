<script>
import Vue from 'vue';
import { Input, Button, Loading } from 'element-ui';
import Validations from 'vuelidate';
import { email, required } from 'vuelidate/lib/validators';
import Logo from '@/components/Logo.vue';
import LogoG from '@/components/LogoG.vue';
import VanIcon from '@/components/VanIcon.vue';
import CountrySelect from '@/components/CountrySelect.vue';

Vue.use(Input);
Vue.use(Button);
Vue.use(Validations);
Vue.use(Loading.directive);

const touchMap = new WeakMap();

export default {
    components: {
        Logo,
        LogoG,
        VanIcon,
        CountrySelect
    },

    data: function() {
        return {
            form: {
                email: null
            },
            stickerForm: {
                name: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                country: 'US'
            },
            loading: false,
            viewIndex: 1
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
                        resolve();
                        // User is signed out.
                    //     reject(new Error('User does not exist'));
                    }
                });

                this.$fireAuth.signInAnonymously().catch(error => {
                    // let errorCode = error.code;
                    // let errorMessage = error.message;
                    console.log("SIGNIN FAILED", error.message);
                    // alert(error);
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

                this.viewIndex = 2;

                // const sendWelcomeEmail = this.$fireFunc.httpsCallable(
                //     'sendWelcomeEmail'
                // );
                // const res1 = await sendWelcomeEmail({
                //     email: this.form.email
                // });
                // console.log('sendWelcomeEmail', res1.data);

                // const sendWelcomeNotificationToAdmin = this.$fireFunc.httpsCallable(
                //     'sendWelcomeNotificationToAdmin'
                // );
                // const res2 = await sendWelcomeNotificationToAdmin({
                //     email: this.form.email
                // });
                // console.log('sendWelcomeNotificationToAdmin', res2.data);
            } catch (e) {
                alert(e);
            }

            this.loading = false;
        },

        async writeStickerForm() {
            try {
                this.loading = true;

                await this.signIn();

                const messageRef = this.$fireStore
                    .collection('signups')
                    .doc(this.form.email);

                await messageRef.set({
                    created: new Date(),
                    customer: this.form.email,
                    name: this.stickerForm.name,
                    address: this.stickerForm.address,
                    city: this.stickerForm.city,
                    state: this.stickerForm.state,
                    zip: this.stickerForm.zip,
                    country: this.stickerForm.country
                });

                // this.form.email = null;
                // this.stickerForm.name = null;
                // this.stickerForm.address = null;
                // this.stickerForm.city = null;
                // this.stickerForm.state = null;
                // this.stickerForm.zip = null;
                // this.stickerForm.country = null;

                this.viewIndex = 3;
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
            },
            stickerForm: {
                name: { required },
                address: { required },
                city: { required },
                state: { required },
                zip: { required },
                country: { required }
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

            <div class="step step1 tac" v-if="viewIndex === 1">
                <div class="headline">
                    <div class="title-container">
                        <h1>
                            {{ $t('PSSSSSST!') }}
                            <svg class="pulse" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <circle id="Oval" cx="512" cy="512" r="512" />
                            </svg>
                        </h1>
                    </div>
                    <div>{{ $t('hey_gymnast_subhead') }}</div>
                </div>

                <div class="spacer">
                    <div class="mbs">
                        <div>{{ $t('Request An Early Access Invite') }}:</div>
                        <div class="fs14">({{ $t('and get a free sticker!') }})</div>
                    </div>

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

                    <div class="mbs mts fs14">{{ $t('We promise to never spam you.') }}</div>
                </div>

                <div class="spacer">
                    <el-button
                        @click="writeToFirestore"
                        :disabled="$v.form.$invalid">{{ $t('Submit') }}</el-button>
                </div>
            </div>


            <div class="step step2" v-if="viewIndex === 2">
                <div class="tac">
                    <h1>{{ $t('You have successfully registered for early access!') }}</h1>

                    <div class="mtl">
                        <div class="inlineBlock vam">{{ $t('Want a free sticker?') }}</div>
                        <div class="inlineBlock vam">
                            <span class="glogo"><logo-g /></span>
                        </div>
                    </div>
                </div>

                <div class="mtl displayTable fs14 mha">
                    <!-- name -->
                    <div class="formRow">
                        <label>{{ $t('Your name') }}:</label>
                        <span>
                            <el-input
                                v-model="stickerForm.name"
                                @change="$v.stickerForm.name.$touch()"
                                :class="{ 'inputError': $v.stickerForm.name.$error }" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.name.$dirty && !$v.stickerForm.name.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <!-- address -->
                    <div class="formRow">
                        <label>{{ $t('Mailing address') }}:</label>
                        <span>
                            <el-input
                                v-model="stickerForm.address"
                                @change="$v.stickerForm.address.$touch()"
                                :class="{ 'inputError': $v.stickerForm.address.$error }" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.address.$dirty && !$v.stickerForm.address.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <!-- city -->
                    <div class="formRow">
                        <label>{{ $t('City') }}:</label>
                        <span>
                            <el-input
                                v-model="stickerForm.city"
                                @change="$v.stickerForm.city.$touch()"
                                :class="{ 'inputError': $v.stickerForm.city.$error }" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.city.$dirty && !$v.stickerForm.city.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <!-- state -->
                    <div class="formRow">
                        <label>{{ $t('State') }}:</label>
                        <span>
                            <el-input
                                v-model="stickerForm.state"
                                @change="$v.stickerForm.state.$touch()"
                                :class="{ 'inputError': $v.stickerForm.state.$error }" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.state.$dirty && !$v.stickerForm.state.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <!-- zip -->
                    <div class="formRow">
                        <label>{{ $t('Postal code') }}:</label>
                        <span>
                            <el-input
                                v-model="stickerForm.zip"
                                @change="$v.stickerForm.zip.$touch()"
                                :class="{ 'inputError': $v.stickerForm.zip.$error }" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.zip.$dirty && !$v.stickerForm.zip.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <!-- country -->
                    <div class="formRow">
                        <label>{{ $t('Country') }}:</label>
                        <span>
                            <country-select v-model="stickerForm.country" />
                            <div
                                role="alert"
                                v-show="$v.stickerForm.country.$dirty && !$v.stickerForm.country.required"
                                class="colorPink fs14 mbs">{{ $t('Required') }}</div>
                        </span>
                    </div>

                    <div class="formRow">
                        <label />
                        <span class="ptl">
                            <el-button
                                type="primary"
                                @click="writeStickerForm"
                                :disabled="$v.stickerForm.$invalid">{{ $t('Submit') }}</el-button>
                        </span>
                    </div>
                </div>
            </div>


            <div class="step step3" v-if="viewIndex === 3" style="position: relative;">
                <div class="tac">
                    <h1>{{ $t('Your sticker is on the way!') }}</h1>
                </div>

                <div class="animation-container">
                    <div class="road" />
                    <div class="animation-wrapper center-position">
                        <div class="racecar">
                            <van-icon />
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <div class="main-media" v-if="viewIndex === 1">
            <div class="image" style="background-image:url(/images/shirts.jpg)" />
        </div>
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

.glogo {
    display: inline-block;
    width: 100px;
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

    h1 {
        position: relative;
        display: block;
        margin: 0;
        font-size: 40px;
        line-height: 1;
        z-index: 1;
        text-shadow: 0px 1px 1px rgba(255, 255, 255, 1);
    }

    .step1 {
        @include flex-grow(1);
        @include flexbox();
        @include flex-direction(column);
        @include justify-content(center);
        margin-top: -125px;
        padding: 50px;

        .pulse {
            z-index: -1;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 30rem;

            circle {
                fill: #ed2189;
                transform: scale(0);
                opacity: 0;
                transform-origin: 50% 50%;
                animation: pulse 2.5s cubic-bezier(0.5, 0.5, 0, 1);
                animation-delay: 1s;
            }
        }

        @keyframes pulse {
            25% {
                opacity: 0.6;
            }
            100% {
                transform: scale(1);
            }
        }

        .title-container {
            font-size: 0;
            position: relative;
            overflow: hidden;
            padding-bottom: 0.4rem;
        }
    }

    input {
        max-width: 400px;
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

        .step {
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

.formRow {
    display: table-row;

    > label {
        font-weight: bold;
        padding: 0 10px 10px 0;
        display: table-cell;
    }

    > span {
        display: table-cell;
        padding-bottom: 10px;
    }
}

@media #{$small-and-down} {
    .formRow {
        display: block;

        > label,
        > span {
            display: block;
        }

        > label {
            padding: 0;
        }

        > span {
            padding: 0 0 10px 0;
        }
    }
}

.inputError {
    border-color: red;
}

.animation-container {
    padding-top: 100px;
}

.animation-wrapper {
    width: 700px;
    bottom: 0;
}

.center-position {
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
}

@keyframes victoryLap {
    0% {
        opacity: 0;
        left: -1080px;
    }
    2%,
    98% {
        opacity: 1;
    }
    // 40%,60% {
    //     left:30px;
    // }
    40%,
    60% {
        left: 300px;
    }
    to {
        opacity: 0;
        left: 1780px;
    }
}

.racecar {
    position: absolute;
    bottom: -1px;
    display: block;
    opacity: 0;
    width: 90px;
    height: 26px;
    animation-name: victoryLap;
    animation-duration: 20s;
    animation-delay: 0.3s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
}

.road {
    position: relative;
    bottom: -28px;
    background-color: rgba(0, 0, 0, 0.1);
    height: 20px;
}
</style>
