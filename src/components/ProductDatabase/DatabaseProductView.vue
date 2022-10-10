<template>
    <section ref="productView" class="product-view">
        <div class="grid-header">
            <h2 class="display-heading">{{ headingText }} <small>{{ subheadingText }}</small></h2>
            <hr>
        </div>

        <div class="product-grid">
            <Product v-for="product in filteredProducts"
                     :key="product.productId"
                     :product="product"
                     :compat-filters-enabled="compatFiltersEnabled"
                     :current-category="currentCategory"
                     :replace-id="replaceId"/>
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
        // TODO: Product sorting! ([replacement device then] compatScore then network count then alphabetic)
        filteredProducts: Array,
        compatFiltersEnabled: Boolean,
        currentCategory: String,
        replaceId: String,
        replaceProduct: Object
    },

    inject: ["allProducts"],

    computed: {
        headingText() {
            if (this.filteredProducts.length === 1) {
                return this.filteredProducts.length + " " + this.$getName.categoryHeadingSingular(this.currentCategory).toLowerCase();
            }
            return this.filteredProducts.length + " " + this.$getName.categoryHeading(this.currentCategory).toLowerCase();
        },
        subheadingText() {
            if (!this.compatFiltersEnabled) {
                return "";
            }

            if (this.replaceId) {
                return `able to replace your ${this.allProducts[this.replaceId].brand} ${this.allProducts[this.replaceId].model}`;
            }

            return "compatible with your home setup";
        },

        sortedProducts() {
            const sorted = [];
            if (this.replaceId && this.replaceProduct && this.filteredProducts.find(product => product.productId === this.replaceProduct.productId)) {

            }
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

.display-heading > small {
    font-size: 0.86em;
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
