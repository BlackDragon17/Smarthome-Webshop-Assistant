<template>
    <section ref="productView" class="product-view">
        <div class="grid-header">
            <h2 class="display-heading">{{ filteredProducts.length }} {{ compatFiltersEnabled ? "compatible" : "" }}
                {{ currentCategory === "all" ? "products" : getPropertyName(currentCategory).toLowerCase() }}</h2>
            <hr>
        </div>

        <div class="product-grid">
            <article class="product-card" v-for="product in filteredProducts">
                <div class="product-icon material-symbols-rounded">
                    {{ getIconName(product.category) }}
                </div>
                <p class="product-name">{{ product.brand }} {{ product.model }}</p>
                <button class="add-product-button btn btn-success relative-centering">Add to home setup</button>
            </article>
        </div>
    </section>
</template>

<script>
export default {
    name: "DatabaseProductView",

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



/* Product grid styling */
.product-grid {
    margin: 0 auto;
    padding: 1rem;
    border: v-bind(productsFlexBorder);

    display: grid;
    grid-template-columns: repeat(v-bind(gridColumns), minmax(15rem, 20rem));
    grid-gap: 1rem;
}


/* Product card styling */

.product-card {
    display: block;
    padding: 1rem;
    height: 16rem;

    border: 1px solid lightgray;
    border-radius: var(--button-border-radius);
    box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.12);

    position: relative;
}

.product-card:hover, .product-card:focus {
    border-color: darkgray;
}

.product-icon {
    display: block;
    margin-bottom: 1.1rem;

    text-align: center;
    font-size: 4rem;
    font-weight: 300;
    font-variation-settings: "GRAD" -200;
}

.product-name {
    font-size: 1.07rem;
    font-weight: 600;
}

.add-product-button {
    background-color: var(--green-devices-main);

    position: absolute;
    bottom: 0.5rem;
}
</style>
