<script>
import Vue from 'vue';
import { Input, Button } from 'element-ui';
import Logo from '@/components/Logo.vue';

Vue.use(Input);
Vue.use(Button);

export default {
    components: {
        Logo
    },

    data: function() {
        return {
            emailAddress: null
        };
    }
};
</script>


<template>
    <section class="container">
        <div class="main-intro">
            <header>
                <logo />
            </header>

            <div class="main-content">
                <div class="headline">
                    <h1>Nice to meet you</h1>
                    <div class="spacer">We are preparing something amazing and exciting for you. Special surprise for our subscribers only.</div>
                </div>

                <div class="spacer">
                    <el-input
                        :placeholder="$t('Email address')"
                        v-model="emailAddress"
                        size="medium" />
                </div>

                <div class="spacer">
                    <el-button>{{ $t('Submit') }}</el-button>
                </div>
            </div>
        </div>
        <div class="main-media">
            <div class="image" style="background-image:url(/images/wieber.jpg)" />
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
            background: #ed2189;
            color: #fff;
            border: 0;
            padding: 15px 30px;
            @include grow();
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
