<template>
    <div class="main">
        <DatabaseSidebar :filters="filters" :all-brands="allBrands"/>

        <DatabaseProductView :filtered-products="filteredProducts"/>
        <button @click="createCompatFilters">Test</button>
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
                category: "all",
                type: "",
                formFactor: "",
                features: [],
                anyBrand: true,
                brands: [],
                // We usually use the OR-selector for supported networks
                // except for the hub-category, where we filter with AND + don't show the any-checkbox
                anyNetwork: true,
                networks: []
            }
        };
    },

    props: {
        currentSetup: Object,
        setupProducts: Array
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

        // TODO: Figure out what to do regarding "bulb" vs "candle"
        filteredProducts() {
            let filteredProducts = [];
            for (const productId in this.allProducts) {
                filteredProducts.push(this.allProducts[productId]);
            }

            if (this.filters.category !== "all") {
                filteredProducts = filteredProducts.filter(product => product.category === this.filters.category || product.category.includes(this.filters.category));
            }
            if (this.filters.type) {
                filteredProducts = filteredProducts.filter(product => product.type === this.filters.type);
            }
            if (this.filters.formFactor) {
                if (this.filters.type === "bulb") {
                    filteredProducts = filteredProducts.filter(product => product.socket === this.filters.formFactor);
                }
            }
            if (this.filters.features) {
                filteredProducts = filteredProducts.filter(product => this.filters.features.every(feature => product[feature]));
            }
            // TODO: Networks
            // if (this.filters.category !== "hub" && )
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
        createCompatFilters() {
            // Find setup hubs which support user's preferred control method.
            const hubs = this.setupProducts.filter(product => product.category === "hub" && (
                (this.currentSetup.controls.assistants?.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant))
                    || (this.currentSetup.controls.brandApps?.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand)))
            ));

            // Get all non-hub products.
            const products = Object.values(this.allProducts).filter(product => product.category !== "hub");

            // By using a map we can form "unions" of the results of the different filters. The map avoids duplicates and has better insertion perf than the JS Object.
            const productsMap = new Map();
            // Compatibility filtering is based on the user's hub(s) and on user's controls as a secondary factor.
            for (const hub of hubs) {
                if (hub.brand === "Philips Hue" && hub.model === "Bridge") {
                    // The Philips Hue Bridge only speaks to Zigbee devices.
                    const relevantProducts = products.filter(product => product.network.zigbee);

                    // The Philips Hue Bridge will only expose Philips Hue or Friends-of-Hue products to HomeKit.
                    if (this.currentSetup.controls.assistants.includes("homeKit")) {
                        relevantProducts.filter(product => product.brand === hub.brand || product.certs?.includes("friendsOfHue"))
                            .map(product => {
                                product.compatScore = 5;
                                product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                                return product;
                            }).forEach(product => productsMap.set(product.productId, product));
                    }

                    // For lights, the Hue Bridge will connect to any Zigbee LL/Gen3 device. For other device types same restrictions as for HomeKit apply.
                    if (["alexa", "googleAssistant", "cortana"].some(assistant => this.currentSetup.controls.assistants.includes(assistant))
                        || this.currentSetup.controls.brandApps.includes(hub.brand)) {
                        relevantProducts.filter(product => (product.category === "light" && product.network.zigbee?.find(type => type === "gen3" || type === "ll"))
                            || product.brand === hub.brand || product.certs?.includes("friendsOfHue")).map(product => {
                            product.compatScore = 5;
                            product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                            return product;
                        }).forEach(product => productsMap.set(product.productId, product));
                    }
                }

                if (hub.brand === "Amazon") {
                    if (hub.model === "Echo" || hub.model.includes("Echo Studio") || hub.model.includes("Echo Show 10")) {
                        // The Amazon Echo, Echo Studio, and Echo Show 10 can speak to Zigbee devices,
                        // as well as to Philips Hue Bluetooth devices (via Philip's custom Alexa Gadget Interface).
                        // Note that devices communicating with Alexa via Wi-Fi do not ever (directly) communicate to an Echo devices and are thus not relevant here.
                        const relevantProducts = products.filter(product => product.network.zigbee || (product.brand === "Philips Hue" && product.network.bluetooth));
                        // No further filtering needed.
                        relevantProducts.map(product => {
                            product.compatScore = 5;
                            product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                            return product;
                        }).forEach(product => productsMap.set(product.productId, product));
                    } else {
                        // Other Echos only do Bluetooth.
                        const relevantProducts = products.filter(product => product.brand === "Philips Hue" && product.network.bluetooth);
                        relevantProducts.map(product => {
                            product.compatScore = 5;
                            product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                            return product;
                        }).forEach(product => productsMap.set(product.productId, product));
                    }
                }

                if (hub.brand === "Aeotec" && hub.model === "Smart Home Hub") {
                    // It's a relatively open platform speaking relatively modern versions of Zigbee and Z-Wave.
                    const relevantProducts = products.filter(product => product.network.zigbee || product.network.zWave);
                    relevantProducts.map(product => {
                        product.compatScore = 5;
                        product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                        return product;
                    }).forEach(product => productsMap.set(product.productId, product));
                }
            }

            // TODO: For Wi-Fi (score 4) and Bluetooth (score 3) devices which qualify (in terms of control) -- add them here.

            console.log("productsMap", productsMap);
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
