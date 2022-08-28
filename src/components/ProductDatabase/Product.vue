<template>
    <article class="product-card">
        <div class="product-icon material-symbols-rounded">
            {{ $getName.categoryIcon(product.category) }}
        </div>
        <h3 class="product-name">{{ product.brand }} {{ product.model }}</h3>
        <p v-for="text in categoryText" class="product-category">{{ text }}</p>
        <hr v-if="compatFiltersEnabled || showMore" class="product-info-hr">
        <p v-if="compatFiltersEnabled">Compatibility: <strong>{{ $getName.compatScore(product.compatScore) }}</strong></p>
        <div v-if="showMore">
            <p v-if="compatFiltersEnabled">{{ compatMsgText }}</p>
            <hr v-if="compatFiltersEnabled" class="product-info-hr">
            <div v-if="product.category === 'hub'">
                <p>Supported assistants: <strong>{{ controlText }}</strong></p>
                <hr class="product-info-hr">
            </div>
            <div v-else-if="product.category === 'light'">
                <p>Brightness: <strong>{{ product.lumen }} lumen</strong></p>
                <hr class="product-info-hr">
                <p>Dimmable: <strong>{{ $getName.boolean2YesNo(product.varLumen) }}</strong></p>
                <hr class="product-info-hr">
                <p>Variable color temperature: <strong>{{ $getName.boolean2YesNo(product.varKelvin) }}</strong></p>
                <hr class="product-info-hr">
                <p>Multicolor (RGB): <strong>{{ $getName.boolean2YesNo(product.multicolor) }}</strong></p>
                <hr class="product-info-hr">
            </div>
            <div v-else-if="product.category === 'sensor' || product.category.includes('sensor')">
                <p>Senses: <strong>{{ senseText }}</strong></p>
                <hr class="product-info-hr">
            </div>
            <p>Connectivity: <strong>{{ networkText }}</strong></p>
            <hr class="product-info-hr">
            <p>Power source: <strong>{{ powerSourceText }}</strong></p>
            <div v-if="product.generation && product.generation !== 'N/A'">
                <hr class="product-info-hr">
                <p>Generation: <strong>{{ product.generation }}</strong></p>
            </div>
            <div v-if="product.revision && product.revision !== 'N/A'">
                <hr v-if="!(product.generation && product.generation !== 'N/A')" class="product-info-hr">
                <p>Revision: <strong>{{ product.revision }}</strong></p>
            </div>
        </div>

        <button class="show-more-button btn btn-outline-secondary" @click="showMore = !showMore">Show {{ showMore ? "less" : "more" }}</button>
        <button class="add-product-button btn btn-success relative-centering" @click="getProduct">Add to home setup</button>
        <button class="spacer btn btn-success" disabled>Spacer</button>
    </article>
</template>

<script>
import { capitalize } from "vue";

export default {
    name: "Product",

    data() {
        return {
            showMore: false
        };
    },

    props: {
        product: Object,
        compatFiltersEnabled: Boolean,
        currentCategory: String
    },

    emits: ["get-new-product"],

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
        },

        compatMsgText() {
            return this.compatFiltersEnabled ? this.product.compatMsg.replace(/-/g, "‑") : "";
        },

        controlText() {
            return this.product.control.map(control => this.$getName.control(control)).join(", ");
        },

        senseText() {
            return this.product.senses?.map((sense, index) => this.product.powerSource.length > 1 && index !== 0
                ? this.$getName.sense(sense).toLowerCase() : this.$getName.sense(sense)).join(", ");
        },

        powerSourceText() {
            return this.product.powerSource.map((powerSource, index) => this.product.powerSource.length > 1 && index !== 0 ?
                this.$getName.powerSource(powerSource).toLowerCase() : this.$getName.powerSource(powerSource)).join(", ");
        },

        networkText() {
            return Object.keys(this.product.network).filter(network => network !== "lan").map(network => this.$getName.network(network)).join(", ");
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
        },

        getProduct() {
            this.$eventBus.$emit("get-new-product", this.product);
        }
    }
};
</script>

<style scoped>
.product-card {
    display: block;
    padding: 1rem;
    min-height: 16rem;

    border: 1px solid lightgray;
    border-radius: var(--button-border-radius);
    box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.12);

    position: relative;
    transition: max-height 0.25s;
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
    margin-bottom: 0.6rem;
    font-size: 1.07rem;
    font-weight: 600;
}

.product-category {
    font-size: 1.05rem;
    font-weight: 500;
}

.product-info-hr {
    margin: 0.5rem 0 0.3rem;
}

strong {
    font-weight: 600;
}


/* Buttons */

.show-more-button {
    display: block;
    margin: 0.8rem auto;

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
