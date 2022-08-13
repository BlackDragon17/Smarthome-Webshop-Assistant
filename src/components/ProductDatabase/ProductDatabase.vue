<template>
    <div class="main">
        <DatabaseSidebar :filter-values="filterValues"
                         :filter-rules="filterRules"
                         :options-all-values="optionsAllValues"
                         :replace-id="replaceId"
                         @compat-filters-toggled="toggleCompatFilters"/>

        <DatabaseProductView :filtered-products="filteredProducts"/>
        <button @click="createCompatFilters">Test</button>
    </div>
</template>

<script>
import DatabaseSidebar from "./DatabaseSidebar.vue";
import DatabaseProductView from "./DatabaseProductView.vue";
import FilterRules from "../../assets/javascript/filter-rules";

export default {
    name: "ProductDatabase",

    components: {
        DatabaseSidebar,
        DatabaseProductView
    },

    data() {
        return {
            defaultFilterValues: {
                category: "all",
                type: "",
                formFactor: "",
                features: [],
                anyNetwork: true,
                networks: [],
                anyBrand: true,
                brands: []
            },

            filterValues: null,
            filterRules: null,

            replaceId: null
        };
    },

    props: {
        currentSetup: Object,
        setupProducts: Array
    },

    inject: ["allProducts"],

    computed: {
        // Return arrays of possible option values, in order to create filter inputs via v-for instead of manually
        allCategories() {
            // Pre-populate the array to show these categories in the specified order.
            const categories = ["hub", "light", "switch", "sensor"];
            for (const productId in this.allProducts) {
                const productCategories = Array.isArray(this.allProducts[productId].category) ?
                    this.allProducts[productId].category : [this.allProducts[productId].category];
                for (const category of productCategories) {
                    if (!categories.includes(category)) {
                        categories.push(category);
                    }
                }
            }
            return categories;
        },
        allBrands() {
            const brands = [];
            for (const productId in this.allProducts) {
                if (!brands.includes(this.allProducts[productId].brand)) {
                    brands.push(this.allProducts[productId].brand);
                }
            }
            return brands;
        },
        optionsAllValues() {
            return {
                allCategories: this.allCategories,
                allBrands: this.allBrands
            };
        },

        // TODO: Figure out what to do regarding "bulb" vs "candle"
        filteredProducts() {
            let filteredProducts = [];
            for (const productId in this.allProducts) {
                filteredProducts.push(this.allProducts[productId]);
            }

            if (this.filterValues.category !== "all") {
                filteredProducts = filteredProducts.filter(product => product.category === this.filterValues.category || product.category.includes(this.filterValues.category));
            }
            if (this.filterValues.type) {
                filteredProducts = filteredProducts.filter(product => product.type === this.filterValues.type);
            }
            if (this.filterValues.formFactor) {
                if (this.filterValues.type === "bulb") {
                    filteredProducts = filteredProducts.filter(product => product.socket === this.filterValues.formFactor);
                }
            }
            if (this.filterValues.features) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.features.every(feature => product[feature]));
            }
            // TODO: Networks
            // if (this.filterValues.category !== "hub" && )
            if (!this.filterValues.anyBrand) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.brands.includes(product.brand));
            }

            return filteredProducts;
        },

        productDatabaseBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        createCompatFilters() {
            this.filterRules = new FilterRules();

            // Find setup hubs which support user's preferred control method.
            const hubs = this.setupProducts.filter(product => product.category === "hub" && (
                (this.currentSetup.controls.assistants?.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant))
                    || (this.currentSetup.controls.brandApps?.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand)))
            ));

            // Get all non-hub products.
            const products = Object.values(this.allProducts).filter(product => product.category !== "hub");

            // By using a map we can form "unions" of the results of the different filters. The map avoids duplicates and has better insertion perf than the JS Object.
            const productsMap = new Map();

            // We process possible compatibilities from the least to the most desirable (i.e. if fitting hubs exist in setup: Bluetooth -> Wi-Fi -> Zigbee/Z-Wave -> Thread).
            // Since each addition of the same product overwrites its last entry, we will thus be able to show it with the best possible connectivity option.
            if (hubs.length > 0) {
                this.filterRules.networks.addAllowed("wifi");
                this.filterRules.networks.addAllowed("bluetooth");
                this.filterWifiAndBluetoothProducts(products, false, productsMap);
            }

            // Compatibility filtering is based on the user's hub(s) and on user's controls as a secondary factor.
            for (const hub of hubs) {
                if (hub.brand === "Philips Hue" && hub.model === "Bridge") {
                    // The Philips Hue Bridge only speaks to Zigbee devices.
                    const relevantProducts = products.filter(product => product.network.zigbee);
                    this.filterRules.networks.addAllowed("zigbee");

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
                        this.filterRules.networks.addAllowed("zigbee");

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
                    this.filterRules.networks.addAllowed("zigbee");
                    this.filterRules.networks.addAllowed("zWave");

                    relevantProducts.map(product => {
                        product.compatScore = 5;
                        product.compatMsg = `Can connect to your ${hub.brand} ${hub.model} hub.`;
                        return product;
                    }).forEach(product => productsMap.set(product.productId, product));
                }
            }

            // In the absence of hubs (with the required control options), Wi-Fi and Bluetooth are instead scored higher at 5 and 4, respectively.
            // Also, switches are handled separately, since direct connectivity to other products must be ensured.
            if (hubs.length <= 0) {
                const relevantSetupProducts = this.setupProducts.filter(product => product.category !== "hub" && product.category !== "switch" && !product.category.includes("switch"));

                // If there are no products in the setup which could be controlled via a switch, we treat switches as any other device.
                if (relevantSetupProducts.length <= 0) {
                    this.filterWifiAndBluetoothProducts(products, true, productsMap);
                }
                // Otherwise, we only allow switches which will actually be able to control the products in the setup.
                else {
                    const nonSwitches = products.filter(product => product.category !== "switch" && !product.category.includes("switch"));
                    this.filterWifiAndBluetoothProducts(nonSwitches, true, productsMap);

                    const switches = products.filter(product => product.category === "switch" || product.category.includes("switch"));
                    // Outside hub-based networks, switches will generally only work with products of the same vendor.
                    for (const setupProduct of relevantSetupProducts) {
                        const setupProductNetworks = Object.values(setupProduct.network);
                        // An exception is made for Philips Hue, where other vendors can implement the Friends Of Hue protocol.
                        if (setupProduct.brand === "Philips Hue") {
                            switches.filter(product => (product.brand === setupProduct.brand || product.certs.includes("friendsOfHue")) && Object.values(product.network).some(network => setupProductNetworks.includes(network)))
                                .map(product => {
                                    product.compatScore = 5;
                                    product.compatMsg = `Can directly control your ${brand} devices.`;
                                    return product;
                                }).forEach(product => productsMap.set(product.productId, product));
                        } else {
                            switches.filter(product => product.brand === setupProduct.brand && Object.values(product.network).some(network => setupProductNetworks.includes(network)))
                                .map(product => {
                                    product.compatScore = 5;
                                    product.compatMsg = `Can directly control your ${brand} devices.`;
                                    return product;
                                }).forEach(product => productsMap.set(product.productId, product));
                        }
                    }
                }
            }

            console.log("productsMap", productsMap);
        },

        /**
         * Avoids code repetition in main filters method by taking care of Wi-Fi and Bluetooth devices.
         * @param products {Array} The base product Array to filter from.
         * @param noHubs {boolean} Upgrades the compatScore if we have no hubs.
         * @param productsMap {Map} The Map to add filtered products to.
         */
        filterWifiAndBluetoothProducts(products, noHubs, productsMap) {
            const bluetoothProducts = products.filter(product => product.network.bluetooth);
            // Vendor app-based control via Bluetooth.
            bluetoothProducts.filter(product => this.currentSetup.controls.brandApps?.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand))
                .map(product => {
                    product.compatScore = noHubs ? 4 : 3;
                    product.compatMsg = `Can connect to the ${product.brand} app via Bluetooth. Note: due to Bluetooth, you must be in the same physical space as this device to control it.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));

            const wifiProducts = products.filter(product => (product.network.wifi || product.network.ethernet));
            // Assistant-based control via Wi-Fi.
            wifiProducts.filter(product => this.currentSetup.controls.assistants?.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant)))
                .map(product => {
                    product.compatScore = noHubs ? 5 : 4;
                    product.compatMsg = `Can connect to ${this.getPropertyName(this.currentSetup.controls.assistants.find(assistant => product.control.includes(assistant)))} via ${product.network.wifi ? "Wi-Fi" : "an ethernet cable"}.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));
            // Vendor app-based control via Wi-Fi.
            wifiProducts.filter(product => this.currentSetup.controls.brandApps?.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand))
                .map(product => {
                    product.compatScore = noHubs ? 5 : 4;
                    product.compatMsg = `Can connect to the ${product.brand} app via ${product.network.wifi ? "Wi-Fi" : "an ethernet cable"}.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));
        },

        createFilterValues(filterValues) {
            const baseFilters = filterValues ? filterValues : {...this.defaultFilterValues};

            // Category (radio)
            if (this.filterRules.category.required.length > 0) {
                baseFilters.category = this.filterRules.category.required[0];
            }
            // Type (radio)
            if (this.filterRules.type.required.length > 0) {
                baseFilters.type = this.filterRules.type.required[0];
            }
            // Form factor (radio)
            if (this.filterRules.formFactor.required.length > 0) {
                baseFilters.formFactor = this.filterRules.formFactor.required[0];
            }
            // Features (checkbox, all-of)
            baseFilters.features = this.filterRules.features.required;
            // Networks (checkbox, category === hub ? all-of : any-of)
            if (baseFilters.category === "hub" && this.filterRules.networks.required > 0) {
                // Actually we'll only half-select these in CSS and not add them to filters.
                // This is because we'll actually filter them based on the any-principle in createHubCompatFilters(),
                // to avoid empty results. Items clicked by users will still follow the all-of principle.
                // baseFilters.anyNetwork = false;
                // baseFilters.networks = this.filterRules.networks.required;
            } else if (Array.isArray(this.filterRules.networks.allowed) && this.filterRules.networks.allowed.length > 0) {
                baseFilters.anyNetwork = false;
                baseFilters.networks = this.filterRules.networks.allowed;
            }
            // Brand (checkbox, any-of)
            if (Array.isArray(this.filterRules.brands.allowed) && this.filterRules.brands.allowed.length > 0) {
                baseFilters.anyBrand = false;
                baseFilters.brands = this.filterRules.brands.allowed;
            }

            this.filterValues = baseFilters;
        },

        toggleCompatFilters(value) {
            if (value) {
                this.createFilterValues({...this.defaultFilterValues, category: this.filterValues.category});
            } else {
                this.filterValues = {...this.defaultFilterValues, category: this.filterValues.category};
            }
        }
    },

    watch: {
        "filterValues.category": {
            handler(newCategory, oldCategory) {
                if (newCategory === "hub") {
                    // TODO
                } else if (oldCategory === "hub") {
                    this.createCompatFilters();
                    this.createFilterValues({...this.filterValues});
                }
            }
        }
    },

    beforeMount() {
        this.createCompatFilters();
        this.createFilterValues();
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
