<template>
    <section ref="productView" class="product-view">
        <div class="grid-header">
            <h2 class="display-heading">{{ headingText }} <small>{{ subheadingText }}</small></h2>
            <hr>
        </div>

        <div class="product-grid">
            <Product v-for="product in sortedProducts"
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

/**
 * Compares two given products.
 * Order of comparison: compatScore > network count > alphabetic.
 * Note that the first two comparison points are evaluated in "reverse":
 * a negative integer is returned if a is bigger than b.
 * @param a {Object} first product in comparison.
 * @param b {Object} second product in comparison.
 * @returns {number} a positive, negative, or zero integer.
 */
function productComparator(a, b) {
    const compatScoreDiff = b.compatScore - a.compatScore;
    if (compatScoreDiff) {
        return compatScoreDiff;
    }

    const networkCountDiff = Object.keys(b.network).length - Object.keys(a.network).length;
    if (networkCountDiff) {
        return networkCountDiff;
    }

    const aName = a.brand + " " + a.model;
    const bName = b.brand + " " + b.model;
    if (aName === bName) {
        return 0;
    }
    return aName > bName ? 1 : -1;
}

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
        currentCategory: String,
        replaceId: String
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
            const sorted = [...this.filteredProducts].sort(productComparator);

            if (this.replaceId) {
                const replaceIndex = sorted.findIndex(product => product.productId === this.replaceId);
                if (replaceIndex < 0) {
                    return sorted;
                }
                const replaceProduct = sorted[replaceIndex];
                sorted.splice(replaceIndex, 1);
                sorted.unshift(replaceProduct);
            }

            return sorted;
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
