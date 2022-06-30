<template>
    <NavHeader ref="header" @header-click="headerAction"/>

    <main ref="app">
        <HomeSetup :all-products="allProducts" :current-setup="currentSetup"/>
    </main>
</template>

<script>
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";

import allProducts from "/resources/products/packed/PackedJSONs.json";
import currentSetup from "/src/assets/default_setups/example1.json";

export default {
    name: "App",

    components: {
        NavHeader,
        HomeSetup
    },

    data() {
        return {
            allProducts,
            currentSetup
        };
    },

    methods: {
        headerAction(target) {
            //TODO: Switch page
            console.log("Header target:", target);
        }
    },

    mounted() {
        // Set the height of the Main content to 100vh - headerHeight
        let headerHeight = this.$refs.header.$el.offsetHeight;
        this.$refs.app.style.height = `calc(100vh - ${headerHeight}px)`;
        this.$refs.app.style.maxHeight = `calc(100vh - ${headerHeight}px)`;
    }
};
</script>

<style>
/* Override and set default styles */

*, ::after, ::before {
    box-sizing: border-box;
}

body {
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Ubuntu, "Open Sans", sans-serif;
    line-height: 1.4;
}

ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
}

p {
    margin: 0;
}


/* Globally available styles */

:root {
    /* Darker values refer relative to lightness in HSL */
    --blue-logo: #1A73E8;

    --blue-rooms-main: #42A5F5;
    --blue-rooms-main-darker10: #128DF3;
    --blue-rooms-main-darker20: #0A72C7;

    --blue-room-background: #E3F2FD;
    --blue-room-border: #9ACFF9;
    --blue-room-text: #1866BF;

    --green-devices-main: #4CAF50;
    --green-devices-main-darker6: #439846;
    --green-devices-main-darker13: #38803A;
}

.box {
    height: 100px;
    margin: 10px;
    background-color: lightgray;
    border: 1px solid darkgray;
}

.inline-icon {
    vertical-align: bottom;
    font-size: 1.4em;
}
</style>
