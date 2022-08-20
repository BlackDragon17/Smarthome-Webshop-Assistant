<template>
    <article class="product-card">
        <div class="product-icon material-symbols-rounded">
            {{ $getName.categoryIcon(product.category) }}
        </div>
        <h3 class="product-name">{{ product.brand }} {{ product.model }}</h3>
        <p v-for="text in categoryText">{{ text }}</p>
        <p>Compatibility: {{ $getName.compatScore(product.compatScore) }}</p>
        <button class="show-more-button btn btn-outline-secondary">Show more</button>
        <button class="add-product-button btn btn-success relative-centering">Add to home setup</button>
        <button class="spacer btn btn-success" disabled>Spacer</button>
    </article>
</template>

<script>
import { capitalize } from "vue";

export default {
    name: "Product",

    props: {
        product: Object,
        currentCategory: String
    },

    computed: {
        categoryText() {
            if (Array.isArray(this.product.category)) {
                const categories = [...this.product.category];
                // Move relevant category to the front
                if (this.currentCategory !== "all") {
                    const index = categories.findIndex(category => category === this.currentCategory);
                    categories.splice(index, 1);
                    categories.unshift(this.currentCategory);
                }
                return categories.map((category, index) =>
                    index !== categories.length - 1 ? this.categoryTextSwitch(category) + "," : this.categoryTextSwitch(category));
            } else {
                return [this.categoryTextSwitch(this.product.category)];
            }
        }
    },

    methods: {
        categoryTextSwitch(category) {
            switch (category) {
                case "hub":
                    return `Hub (${this.product.type})`;
                case "light":
                    return this.product.type === "bulb" ? "Light bulb" : this.$getName.camelCase2Text(this.product.type);
                case "switch":
                    return `${capitalize(this.product.type)} (${this.$getName.camelCase2Text(this.product.subtype).toLowerCase()})`;
                case "sensor":
                    return this.product.senses.length > 1 ? `Sensor: ${this.product.senses.length} senses`
                        : this.$getName.sense(this.product.senses[0]) + " sensor";
                default:
                    return `${capitalize(category)} (${this.$getName.camelCase2Text(this.product.type).toLowerCase()})`;
            }
        }
    }
};
</script>

<style scoped>
.product-card {
    display: block;
    padding: 1rem;
    min-height: 16rem;
    max-height: 35rem;

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


/* Buttons */

.show-more-button {
    display: block;
    margin: 1rem auto;

    border: 1px solid var(--bs-btn-border-color);
}

.add-product-button {
    background-color: var(--green-devices-main);

    position: absolute;
    bottom: 0.5rem;
}

.spacer {
    margin-bottom: -0.5rem;
    visibility: hidden;
}
</style>
