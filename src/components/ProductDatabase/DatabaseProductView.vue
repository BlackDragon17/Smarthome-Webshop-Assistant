<template>
    <section ref="productView" class="product-view">
        <div class="reference-element" ref="referenceElement"></div>
        <div class="product-grid">
            <article class="product" v-for="product in filteredProducts">
                {{ product.brand }} {{ product.model }} test{{test}}
            </article>
        </div>
    </section>
</template>

<script>
export default {
    name: "DatabaseProductView",

    data() {
        return {
            productWidth: 0,
            gridColumns: 1,
            resizeObserver: null
        };
    },

    props: {
        filteredProducts: Array
    },

    inject: ["allProducts"],

    computed: {
        cssGridColumnsNr() {
            const viewWidth = this.$refs.productView.offsetWidth
            return `calc(${viewWidth} / ${this.test})`;
        },
        productsFlexBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkorchid";
        }
    },

    mounted() {
        // Convert rem to px in JS
        this.productWidth = parseInt(getComputedStyle(this.$refs.referenceElement).getPropertyValue("width"), 10);

        this.resizeObserver = new ResizeObserver(() => {
            const viewWidth = this.$refs.productView.offsetWidth - 20;
            this.gridColumns = Math.min(Math.max(Math.floor(viewWidth / this.productWidth), 1), 5);
        });
        this.resizeObserver.observe(this.$refs.productView);
    }
};
</script>

<style scoped>
/* Page layout */

.product-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}

.product-grid {
    margin: 2rem 1rem;
    border: v-bind(productsFlexBorder);

    display: grid;
    grid-template-columns: repeat(v-bind(gridColumns), minmax(15rem, 18rem));
    /* grid-template-columns: repeat(calc(4px / 2px), minmax(15rem, 18rem)); */
    grid-gap: 1rem;
}

/* @media screen and (min-width: 768px) { */
/*     .product-grid { */
/*         margin: 3rem; */
/*     } */
/* } */

/* @media screen and (min-width: 1024px) { */
/*     .product-grid { */
/*         grid-template-columns: repeat(3, minmax(15rem, 18rem)); */
/*     } */
/* } */

/* @media screen and (min-width: 1300px) { */
/*     .product-grid { */
/*         grid-template-columns: repeat(4, minmax(15rem, 18rem)); */
/*     } */
/* } */

/* @media screen and (min-width: 1500px) { */
/*     .product-grid { */
/*         grid-template-columns: repeat(5, minmax(15rem, 20rem)); */
/*     } */
/* } */

.product {
    display: block;
    /* width: 100px; */
    height: 200px;

    border: 1px solid darkgray;
}

.reference-element {
    display: none;
    width: 15rem;
}
</style>
