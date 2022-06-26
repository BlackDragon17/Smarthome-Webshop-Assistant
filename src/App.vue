<template>
    <NavHeader ref="header" @header-click="headerAction"/>

    <main ref="app">
        <HomeSetup :all-products="allProducts" :current-setup="currentSetup"/>
    </main>
</template>

<script>
import allProducts from "/resources/products/packed/PackedJSONs.json";
import currentSetup from "/src/assets/default_setups/example1.json";

export default {
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

.inline-icon {
    vertical-align: bottom;
    font-size: 1.4em;
}
</style>
