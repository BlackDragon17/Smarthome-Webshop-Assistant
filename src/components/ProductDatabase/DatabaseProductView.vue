<template>
    <section ref="productView" class="product-view">
        <div class="products-flex">
            <article class="product">
                Selected category: {{ filters.category }}
            </article>
        </div>
    </section>
</template>

<script>
export default {
    name: "DatabaseProductView",

    props: {
        filters: Object
    },

    inject: ["allProducts"],

    computed: {
        productsFlexBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkorchid";
        }
    }
};
</script>

<style scoped>
/* Page layout */

.product-view {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.products-flex {
    margin: 2rem;
    border: v-bind(productsFlexBorder);

    display: flex;
    flex-direction: row;
}
</style>
