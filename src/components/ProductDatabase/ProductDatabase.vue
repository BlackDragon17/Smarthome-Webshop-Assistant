<template>
    <div class="main">
        <DatabaseSidebar/>

        <DatabaseProductView/>
    </div>
</template>

<script>
import DatabaseSidebar from "./DatabaseSidebar.vue";
import DatabaseProductView from "./DatabaseProductView.vue";

export default {
    name: "ProductDatabase",

    components: {
        DatabaseSidebar,
        DatabaseProductView
    },

    mounted() {
        this.$root.activeViewRoot = this.$el;
    }
};
</script>

<style scoped>
.main {
    height: 100%;

    display: flex;
    flex-direction: row;
}

.main > * {
    border: v-bind(homeSetupBorder);
}

.sidebar {
    flex-shrink: 0;
}

.product-view {
    flex-grow: 1;
}
</style>
