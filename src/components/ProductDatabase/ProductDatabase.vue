<template>
    <div class="main">
        <DatabaseSidebar :filters="filters" :all-brands="allBrands"/>

        <DatabaseProductView :filters="filters"/>
        <!--<button @click="test">Test</button>-->
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

    data() {
        return {
            filters: {
                category: "light",
                type: "",
                formFactor: "",
                features: [],
                anyBrand: true,
                brands: []
            }
        };
    },

    inject: ["allProducts"],

    computed: {
        allBrands() {
            const brands = [];
            for (const productId in this.allProducts) {
                if (!brands.includes(this.allProducts[productId].brand)) {
                    brands.push(this.allProducts[productId].brand);
                }
            }
            return brands;
        },

        filteredProducts() {
            let filteredProducts = [];
            for (const productId in this.allProducts) {
                filteredProducts.push(this.allProducts[productId]);
            }

            if (this.filters.category !== 'all') {
                filteredProducts = filteredProducts.filter(product => product.category === this.filters.category);
            }
            if (this.filters.type) {
                filteredProducts = filteredProducts.filter(product => product.type === this.filters.type);
            }
            if (this.filters.formFactor) {
                if (this.filters.type === "bulb") {
                    filteredProducts = filteredProducts.filter(product => product.socket === this.filters.formFactor);
                }
            }
            if (!this.filters.anyBrand) {
                filteredProducts = filteredProducts.filter(product => this.filters.brands.includes(product.brand));
            }

            return filteredProducts;
        },

        productDatabaseBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        test() {
            this.allProducts.forEach(() => console.log('aaa'));
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
