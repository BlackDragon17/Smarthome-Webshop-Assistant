<template>
    <section ref="productView" class="product-view">
        <div class="grid-header">
            <h2 class="display-heading">{{ filteredProducts.length }} {{ compatFiltersEnabled ? "compatible" : "" }}
                {{ currentCategory === "all" ? "products" : $getName.categoryHeading(currentCategory).toLowerCase() }}</h2>
            <hr>
        </div>

        <div class="product-grid">
            <Product v-for="product in filteredProducts" :key="product.productId" :product="product" :current-category="currentCategory"/>
        </div>
    </section>
</template>

<script>
import Product from "@/components/ProductDatabase/Product.vue";

export default {
    name: "DatabaseProductView",

    components: {
        Product
    },

    data() {
        return {
            remInPx: 16,
            gridColumns: 1,
            resizeObserver: null
        };
    },

    props: {
        filteredProducts: Array,
        compatFiltersEnabled: Boolean,
        currentCategory: String
    },

    inject: ["allProducts"],

    computed: {
        headingText() {

        },

        productsFlexBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkorchid";
        }
    },

    methods: {
        setGridColumns() {
            const viewWidth = this.$refs.productView?.offsetWidth;
            // 15rem width + 1rem margin + single grid margin + 4px buffer
            const productWidth = this.remInPx * 17 + 4;
            const columns = Math.floor(viewWidth / productWidth);
            const clampMin = 1;
            const clampMax = this.$refs.productView?.offsetWidth > 1800 ? 5 : 4;
            this.gridColumns = Math.min(Math.max(columns, clampMin), clampMax);
        }
    },

    mounted() {
        // Get current rem in px value
        this.remInPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("font-size"));

        this.resizeObserver = new ResizeObserver(this.setGridColumns);
        this.resizeObserver.observe(this.$refs.productView);
    }
};
</script>

<style scoped>
/* Page layout */

.product-view {
    display: flex;
    flex-direction: column;
    overflow: auto;
}


/* Grid header */

.grid-header {
    padding: 1rem;
}

.display-heading {
    margin-left: 0.4rem;
    font-size: 1.5rem;
}

.grid-header > hr {
    margin-bottom: 0;
}


/* Product grid */
.product-grid {
    margin: 0 auto;
    padding: 1rem;
    border: v-bind(productsFlexBorder);

    display: grid;
    grid-template-columns: repeat(v-bind(gridColumns), minmax(15rem, 20rem));
    grid-gap: 1rem;
}
</style>
