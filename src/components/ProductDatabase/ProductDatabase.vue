<template>
    <div class="main">
        <DatabaseSidebar :all-brands="allBrands"/>

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

    inject: ["allProducts"],

    computed: {
        allBrands() {
            const brands = [];
            for (const productId in this.allProducts) {
                if (!brands.find(brand => brand === this.allProducts[productId].brand)) {
                    brands.push(this.allProducts[productId].brand);
                }
            }
            return brands;
        },

        productDatabaseBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
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
    border: v-bind(productDatabaseBorder);
}

.sidebar {
    flex-shrink: 0;
}

.product-view {
    flex-grow: 1;
}
</style>
