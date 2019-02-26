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
            <header>
                <logo />
            </header>

            <div class="main-content">
                <div class="headline">
                    <h1>Nice to meet you</h1>
                    <div class="spacer">
                        We are preparing something amazing and exciting for you. Special surprise for our subscribers only.
                    </div>
                </div>

                <div class="spacer">
                    <el-input
                        v-model="form.email"
                        :placeholder="$t('Email address')"
                        :class="{ 'inputError': $v.form.email.$error }"

                        @change="delayTouch($v.form.email)" />

                    <div
                        role="alert"
                        v-show="$v.form.email.$dirty"
                        class="colorPink fs14">
                        <div v-if="!$v.form.email.email">{{ $t('Please enter a valid email address.') }}</div>
                    </div>
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
            :title="$t('Thanks!')"
            :visible.sync="successDialogVisible"
            width="50%">
            <span>This is a message</span>
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
    @include flex-direction(column);
    @include justify-content(center);
    @include align-items(center);
}

.main-intro {
    background-color: #203160;
    @include flexbox();
    @include flex-direction(column);

    .spacer {
        margin-top: 40px;
    }

    header {
        display: block;
        margin: 40px 50px 50px;
        @include flex-grow(0);
    }

    .main-content {
        @include flex-grow(1);
        @include flexbox();
        @include flex-direction(column);
        @include justify-content(center);
        margin-top: -150px;
        padding: 50px;
        // @include align-items(center);
        // @include justify-content(center);
        // @include align-items(center);

        .headline {
            font-size: 20px;
            color: #fff;

            h1 {
                font-size: 50px;
                font-weight: 600;
                margin: 0;
                line-height: 50px;
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
            width: 300px;
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

@media #{$medium-and-up} {
    .container {
        @include flex-direction(row);
    }

    .main-intro {
        .headline {
            h1 {
                font-size: 70px;
                font-weight: 700;
            }
        }
    }
}
</style>
