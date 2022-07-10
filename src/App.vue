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
            this.$eventBus.$emit("focus-home-setup");
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
    --blue-logo: #1A73E8;

    --old-blue-rooms-main: #42A5F5;
    --blue-rooms-main: #2A99F4;
    --blue-rooms-main-darker1: #0C80DF;    /* lightness -10 */
    --blue-rooms-main-darker2: #0964AE;    /* lightness -20 */

    --blue-room-background: #E3F2FD;
    --blue-room-border: #9ACFF9;
    --blue-room-text: #1866BF;

    --green-devices-main: #4CAF50;
    --green-devices-main-darker1: #439846;    /* lightness -6 */
    --green-devices-main-darker2: #38803A;    /* lightness -13 */
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

.relative-centering {
    /* https://www.w3.org/Style/Examples/007/center.en.html#hv3 */
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, 0);
}

.hidden {
    visibility: hidden;
}
</style>
