<template>
    <div class="main">
        <ConfirmCancelActionModal ref="confirmCancelActionModal"
                                  :current-view="$options.name"
                                  :replace-product="replaceProduct"
                                  @cancel-action="confirmCancel"/>

        <DatabaseSidebar :compat-filters-control="compatFiltersControl"
                         :filter-values="filterValues"
                         :filter-rules="filterRules"
                         :options-all-values="optionsAllValues"
                         :replace-id="replaceId"/>

        <DatabaseProductView :filtered-products="filteredProducts"
                             :compat-filters-enabled="compatFiltersControl.value"
                             :current-category="filterValues.category"
                             :replace-id="replaceId"
                             :home-setup-no-rooms="homeSetupNoRooms"/>
    </div>
</template>

<script>
import FilterRules from "@/assets/javascript/filter-rules";
import FilterValues from "@/assets/javascript/filter-values";
import ConfirmCancelActionModal from "@/components/ConfirmCancelActionModal.vue";
import DatabaseSidebar from "./DatabaseSidebar.vue";
import DatabaseProductView from "./DatabaseProductView.vue";

export default {
    name: "ProductDatabase",

    components: {
        ConfirmCancelActionModal,
        DatabaseSidebar,
        DatabaseProductView
    },

    data() {
        return {
            compatFiltersControl: {
                value: true,
                disabled: false
            },

            defaultFilterValues: new FilterValues(),
            filterValues: new FilterValues(),
            filterRules: new FilterRules(),

            productsMap: null
        };
    },

    props: {
        currentSetup: Object,
        setupProducts: Array,
        replaceId: String,
        allBrands: Array
    },

    emits: ["change-view"],

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
        allSenses() {
            const senses = [];
            for (const productId in this.allProducts) {
                if (this.allProducts[productId].category === "sensor" || this.allProducts[productId].category.includes("sensor")) {
                    for (const sense of this.allProducts[productId].senses) {
                        if (!senses.includes(sense)) {
                            senses.push(sense);
                        }
                    }
                }
            }
            return senses.sort();
        },
        optionsAllValues() {
            return {
                allCategories: this.allCategories,
                allSenses: this.allSenses,
                allBrands: this.allBrands
            };
        },

        replaceProduct() {
            return this.replaceId != null ? this.allProducts[this.replaceId] : null;
        },

        /**
         * Applies filterValues (which model the sidebar checkboxes) to products.
         * Uses productsMap or allProducts as filter-base depending on the "compatibility filters" switch.
         * @returns {product[]} The final products array to be displayed in the DatabaseProductView.
         */
        filteredProducts() {
            console.log("applying filterValues:", {...this.filterValues});
            let filteredProducts = [];
            if (this.compatFiltersControl.value) {
                for (const product of this.productsMap.values()) {
                    filteredProducts.push(product);
                }
            } else {
                for (const productId in this.allProducts) {
                    filteredProducts.push(this.allProducts[productId]);
                }
            }
            console.log("products before:", filteredProducts);

            // Category
            if (this.filterValues.category !== this.defaultFilterValues.category) {
                filteredProducts = filteredProducts.filter(product => product.category === this.filterValues.category || product.category.includes(this.filterValues.category));
            }
            // console.log("amount after filter step 1:", filteredProducts.length);
            // Type
            if (this.filterValues.type !== this.defaultFilterValues.type) {
                filteredProducts = filteredProducts.filter(product => product.type === this.filterValues.type);
            }
            // console.log("amount after filter step 2:", filteredProducts.length);
            // Form factor
            if (this.filterValues.formFactor !== this.defaultFilterValues.formFactor) {
                if (this.filterValues.type === "bulb") {
                    filteredProducts = filteredProducts.filter(product => product.socket === this.filterValues.formFactor);
                }
            }
            // console.log("amount after filter step 3:", filteredProducts.length);
            // Senses
            if (!this.filterValues.anySense) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.senses.every(sense => product.senses.includes(sense)));
            }
            // console.log("amount after filter step 4:", filteredProducts.length);
            // Features
            if (this.filterValues.features.length > 0) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.features.every(feature => product[feature]));
            }
            // console.log("amount after filter step 5:", filteredProducts.length);
            // Networks
            if (!this.filterValues.anyNetwork && this.filterValues.category === "hub") {
                filteredProducts = filteredProducts.filter(product => this.filterValues.networks.every(network => product.network[network]));
            } else if (!this.filterValues.anyNetwork) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.networks.some(network => product.network[network]));
            }
            // console.log("amount after filter step 6:", filteredProducts.length);
            // Brand
            if (!this.filterValues.anyBrand) {
                filteredProducts = filteredProducts.filter(product => this.filterValues.brands.includes(product.brand));
            }
            console.log("products after:", filteredProducts);

            return filteredProducts;
        },

        homeSetupEmpty() {
            return this.currentSetup.rooms.length <= 0 || this.currentSetup.devices.length <= 0;
        },

        homeSetupNoRooms() {
            return this.currentSetup.rooms.length <= 0;
        },

        productDatabaseBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        /**
         * This is where the main product compatibility logic is housed.
         * Applies advanced filtering to allProducts and saves the result to productsMap.
         * Also creates {@link FilterRules} used to disable and preselect the sidebar's filter checkboxes.
         */
        createCompatFilters() {
            this.filterRules = new FilterRules();

            // If the user has specified no control methods, add allAssistants to controls,
            // except for Apple HomeKit, as that comes with many restrictions.
            let mockedAssistants = false;
            if (this.currentSetup.controls.assistants.length <= 0 && this.currentSetup.controls.brandApps.length <= 0) {
                mockedAssistants = true;
                this.currentSetup.controls.assistants = Object.keys(this.$getName.allAssistants).filter(assistant => assistant !== "homeKit");
            }

            // Find setup hubs which support user's preferred control method.
            const setupHubs = this.setupProducts.filter(product => product.category === "hub" && (
                (this.currentSetup.controls.assistants.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant))
                    || (this.currentSetup.controls.brandApps.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand)))
            ));

            // Get all non-hub products.
            const products = Object.values(this.allProducts).filter(product => product.category !== "hub");

            // By using a map we can form "unions" of the results of the different filters. The map avoids duplicates and has better insertion perf than the JS Object.
            const productsMap = new Map();

            // We process possible compatibilities from the least to the most desirable (i.e. if fitting hubs exist in setup: Bluetooth -> Wi-Fi -> Zigbee/Z-Wave -> Thread).
            // Since each addition of the same product overwrites its last entry, we will thus be able to show it with the best possible connectivity option.
            if (setupHubs.length > 0) {
                this.filterRules.networks.addAllowed("lan");
                this.filterRules.networks.addAllowed("bluetooth");
                this.filterLanAndBluetoothProducts(products, false, productsMap);
            }

            // Compatibility filtering is based on the user's hub(s) and on user's controls as a secondary factor.
            for (const hub of setupHubs) {
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
            if (setupHubs.length <= 0) {
                const relevantSetupProducts = this.setupProducts.filter(product => product.category !== "hub" && product.category !== "switch" && !product.category.includes("switch"));

                // If there are no products in the setup which could be controlled via a switch, we treat switches as any other device.
                if (relevantSetupProducts.length <= 0) {
                    this.filterLanAndBluetoothProducts(products, true, productsMap);
                }
                // Otherwise, we only allow switches which will actually be able to control the products in the setup.
                else {
                    const nonSwitches = products.filter(product => product.category !== "switch" && !product.category.includes("switch"));
                    this.filterLanAndBluetoothProducts(nonSwitches, true, productsMap);

                    const switches = products.filter(product => product.category === "switch" || product.category.includes("switch"));
                    // Outside hub-based networks, switches will generally only work with products of the same vendor.
                    for (const setupProduct of relevantSetupProducts) {
                        const setupProductNetworks = Object.values(setupProduct.network);
                        // An exception is made for Philips Hue, where other vendors can implement the Friends Of Hue protocol.
                        if (setupProduct.brand === "Philips Hue") {
                            if (!setupProduct.network.bluetooth) continue;
                            switches.filter(swtch => (swtch.brand === setupProduct.brand || swtch.certs?.includes("friendsOfHue")) && swtch.network.bluetooth)
                                .map(swtch => {
                                    swtch.compatScore = 5;
                                    swtch.compatMsg = `Can directly control your Philips Hue devices.`;
                                    return swtch;
                                }).forEach(swtch => productsMap.set(swtch.productId, swtch));
                        } else {
                            switches.filter(swtch => swtch.brand === setupProduct.brand && Object.values(swtch.network).some(network => setupProductNetworks.includes(network)))
                                .map(swtch => {
                                    swtch.compatScore = 5;
                                    swtch.compatMsg = `Can directly control your ${setupProduct.brand} devices.`;
                                    return swtch;
                                }).forEach(swtch => productsMap.set(swtch.productId, swtch));
                        }
                    }
                }
            }

            // Hubs filtering
            // Unlike with the filtering of other devices, the general compatibility filtering of hubs will not be adding any network entries to FilterRules.
            // This is because we cannot make any pre-selections in an all-of filter, as that could cause us to not display any compatible products.
            // Leaving networks filtering at any-of for hubs isn't an option either, since the user would then have no way of e.g. enforcing the hubs to have Bluetooth.
            // The option of mixing all-of and any-of with visual annotation is overly complex both for the usability and program logic. Thus, no pre-selections.

            const setupProducts = this.setupProducts.filter(product => product.category !== "hub");
            this.findCompatibleHubs(setupProducts, productsMap);

            // Reverse the mocking of assistants described above, if it had been done
            if (mockedAssistants) {
                this.currentSetup.controls.assistants = [];
            }

            this.productsMap = productsMap;
        },

        /**
         * Finds compatible hubs based on the given setup products and adds them to the productsMap.
         * Can be used both for either finding hubs generally compatible to the whole setup, or compatible to one specific device.
         * @param {product[]} setupProducts Array of product(s) to base the filtering off of.
         * @param {Map} productsMap A productsMap to add the results to.
         */
        findCompatibleHubs(setupProducts, productsMap) {
            // Get all hub products which support the user's preferred control method.
            let hubs = Object.values(this.allProducts).filter(product => product.category === "hub" && (
                (this.currentSetup.controls.assistants.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant))
                    || (this.currentSetup.controls.brandApps.length > 0 && product.control.includes("brandApp")
                        && this.currentSetup.controls.brandApps.some(brand => brand === product.brand)))
            ));

            // Similarly to how product filtering is setupHub-centric, hub filtering is setupProduct-centric,
            // except here we don't for-loop over the setupProducts since we don't want to add hubs which can only
            // connect to a single device in the house -- or at least be able to penalize the compatScore appropriately.
            // Also like above, we begin with the worst connectivity options and end with the best.

            // Amazon Echo hubs offer the unique capability of controlling Philips Hue devices via Bluetooth.
            if (setupProducts.filter(product => product.brand === "Philips Hue" && product.category === "light" && product.network.bluetooth).length > 0) {
                const relevantHubs = hubs.filter(hub => hub.brand === "Amazon" && hub.model.includes("Echo"));
                relevantHubs.map(hub => {
                    hub.compatScore = 3;
                    hub.compatMsg = "Can directly connect to and control your Philips Hue lights via Alexa.";
                    return hub;
                }).forEach(hub => productsMap.set(hub.productId, hub));
            }

            const hubDependants = setupProducts.filter(product => product.network.thread || product.network.zigbee || product.network.zWave);
            const zigbeeProducts = hubDependants.filter(product => product.network.zigbee);
            const zWaveProducts = hubDependants.filter(product => product.network.zWave);
            const zigbeeHueProducts = zigbeeProducts.filter(product => product.brand === "Philips Hue" || product.certs?.includes("friendsOfHue"));

            // Philips Hue Bridge logic
            if (zigbeeProducts.length > 0) {
                const hueBridgeHubs = hubs.filter(hub => hub.brand === "Philips Hue" && hub.category === "hub" && hub.network.zigbee);
                // If we only use HomeKit, we can only use the Hue Bridge if we only have Philips Hue / Friends-of-Hue devices at home,
                // since those are the only ones which the bridge exposes to HomeKit.
                if (this.currentSetup.controls.assistants.includes("homeKit") && this.currentSetup.controls.assistants.length === 1
                    && !this.currentSetup.controls.brandApps.includes("Philips Hue")) {
                    if (zigbeeProducts.length === zigbeeHueProducts.length) {
                        hueBridgeHubs.map(hub => {
                            hub.compatScore = hubDependants.length === zigbeeProducts.length ? 5 : 4;
                            hub.compatMsg = "Allows you to control all of your Philips Hue devices via HomeKit.";
                            return hub;
                        }).forEach(hub => productsMap.set(hub.productId, hub));
                    }
                } else {
                    const zigbeeHueCompatProducts = zigbeeProducts.filter(product => product.category === "light"
                        || (product => product.brand === "Philips Hue" || product.certs?.includes("friendsOfHue")));
                    // We should only recommend the Philips Hue Bridge if it can actually control all the Setup's Zigbee devices.
                    if (zigbeeProducts.length === zigbeeHueCompatProducts.length) {
                        hueBridgeHubs.map(hub => {
                            hub.compatScore = hubDependants.length === zigbeeProducts.length ? 5 : 4;
                            hub.compatMsg = "Allows you to control all of your Zigbee devices.";
                            return hub;
                        }).forEach(hub => productsMap.set(hub.productId, hub));
                    }
                }
                hubs = hubs.filter(hub => !hueBridgeHubs.find(hbh => hbh.productId === hub.productId));
            }

            // General Zigbee & Z-Wave logic
            // The only application-layer protocol for Thread which can currently be found in consumer smart home devices is HomeKit.
            // Thus, below we only handle Zigbee & Z-Wave, with Thread handled in the HomeKit section.
            const remainingHubs = hubs.filter(hub => !productsMap.has(hub.productId));
            const hubDepsNonThread = hubDependants.filter(product => product.network.zigbee || product.network.zWave);
            if (hubDepsNonThread.length > 0) {
                if (zigbeeProducts.length === hubDepsNonThread.length) {
                    remainingHubs.filter(hub => hub.network.zigbee).map(hub => {
                        hub.compatScore = 5;
                        hub.compatMsg = "Allows you to control all of your Zigbee devices.";
                        return hub;
                    }).forEach(hub => productsMap.set(hub.productId, hub));
                } else if (zWaveProducts.length === hubDepsNonThread.length) {
                    remainingHubs.filter(hub => hub.network.zWave).map(hub => {
                        hub.compatScore = 5;
                        hub.compatMsg = "Allows you to control all of your Z-Wave devices.";
                        return hub;
                    }).forEach(hub => productsMap.set(hub.productId, hub));
                } else {
                    remainingHubs.filter(hub => hub.network.zigbee || hub.network.zWave).map(hub => {
                        hub.compatScore = (hub.network.zigbee && hub.network.zWave) ? 5 : 4;
                        hub.compatMsg = `Allows you to control ${(hub.network.zigbee && hub.network.zWave) ? "all" : "some"} of your smart home devices.`;
                        return hub;
                    }).forEach(hub => productsMap.set(hub.productId, hub));
                }
            }

            // HomeKit hubs logic
            if (this.currentSetup.controls.assistants.includes("homeKit")) {
                const homeKitProducts = setupProducts.filter(product => product.control.includes("homeKit"));

                // For HomeKit setups, direct HomeKit devices will have to connect to a HomeKit endpoint one way or another.
                // It is better for that endpoint to be a dedicated homeKitHubType=hub rather than just a phone,
                // since that enables device remote control outside the range of Bluetooth / the Wi-Fi router.
                if (homeKitProducts.length > 0) {
                    const homeKitLanBtProducts = homeKitProducts.filter(product => product.network.lan || product.network.bluetooth);
                    if (homeKitLanBtProducts.length > 0) {
                        const relevantHubs = hubs.filter(hub => hub.brand === "Apple" && (hub.network.lan || hub.network.bluetooth));
                        relevantHubs.map(hub => {
                            hub.compatScore = 4;
                            hub.compatMsg = "Allows you to control your HomeKit devices from afar by acting as a HomeKit relay.";
                            return hub;
                        }).forEach(hub => productsMap.set(hub.productId, hub));
                    }

                    // HomeKit over Thread requires an Apple HomeKit hub (homeKitHubType=hub) to work at all.
                    if (homeKitProducts.find(product => product.network.thread)) {
                        const relevantHubs = hubs.filter(hub => hub.brand === "Apple" && hub.network.thread?.includes("borderRouter"));
                        relevantHubs.map(hub => {
                            hub.compatScore = 6;
                            hub.compatMsg = "An Apple hub such as this allows your HomeKit devices to create a Thread network.";
                            return hub;
                        }).forEach(hub => productsMap.set(hub.productId, hub));
                    }
                }
            }

            if (this.replaceId) {
                this.setFilterRulesForReplacement();
            }
        },

        /**
         * Avoids code repetition in main filters method by taking care of Wi-Fi/ethernet and Bluetooth devices.
         * @param {Array} products The base product Array to filter from.
         * @param {boolean} noHubs Upgrades the compatScore if we have no hubs.
         * @param {Map} productsMap The Map to add filtered products to.
         */
        filterLanAndBluetoothProducts(products, noHubs, productsMap) {
            const bluetoothProducts = products.filter(product => product.network.bluetooth);
            // Vendor app-based control via Bluetooth.
            bluetoothProducts.filter(product => this.currentSetup.controls.brandApps.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand))
                .map(product => {
                    product.compatScore = noHubs ? 4 : 3;
                    product.compatMsg = `Can connect to the ${product.brand} app via Bluetooth. Note: due to Bluetooth, you must be in the same physical space as this device to control it.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));

            const lanProducts = products.filter(product => product.network.lan);
            // Assistant-based control via Wi-Fi.
            lanProducts.filter(product => this.currentSetup.controls.assistants.length > 0 && this.currentSetup.controls.assistants.some(assistant => product.control.includes(assistant)))
                .map(product => {
                    product.compatScore = noHubs ? 5 : 4;
                    product.compatMsg = `Can connect to ${this.$getName.control(this.currentSetup.controls.assistants.find(assistant => product.control.includes(assistant)))} via ${product.network.wifi ? "Wi-Fi" : "an ethernet cable"}.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));
            // Vendor app-based control via Wi-Fi.
            lanProducts.filter(product => this.currentSetup.controls.brandApps.length > 0 && product.control.includes("brandApp") && this.currentSetup.controls.brandApps.some(brand => brand === product.brand))
                .map(product => {
                    product.compatScore = noHubs ? 5 : 4;
                    product.compatMsg = `Can connect to the ${product.brand} app via ${product.network.wifi ? "Wi-Fi" : "an ethernet cable"}.`;
                    return product;
                }).forEach(product => productsMap.set(product.productId, product));
        },

        setFilterRulesForReplacement() {
            const product = this.allProducts[this.replaceId];

            if (Array.isArray(product.category)) {
                this.filterRules.category.allowed = [...product.category];
            } else {
                this.filterRules.category.allowed = [product.category];
                this.filterRules.category.required = [product.category];
            }

            if (product.type && product.category !== "hub") {
                this.filterRules.type.allowed = [product.type];
                this.filterRules.type.required = [product.type];
            }

            if (product.formFactor) {
                this.filterRules.formFactor.allowed = [product.formFactor];
                this.filterRules.formFactor.required = [product.formFactor];
            }
            if (product.socket) {
                this.filterRules.formFactor.allowed = [product.socket];
                this.filterRules.formFactor.required = [product.socket];
            }

            if (product.senses) {
                this.filterRules.senses.selected = [...product.senses];
            }

            if (product.category === "light") {
                this.filterRules.features.selected = ["varLumen", "varKelvin", "multicolor"].filter(feature => product[feature]);
            }

            if (Array.isArray(this.filterRules.networks.allowed)) {
                const filteredNetworks = this.filterRules.networks.allowed.filter(network => Object.keys(product.network).includes(network));
                this.filterRules.networks.allowed = filteredNetworks.length > 0 ? filteredNetworks : this.filterRules.networks.allowed;
            }
        },

        /**
         * Computes pre-selections of the sidebar filter checkboxes (modelled via filterValues)
         * based on the FilterRules created by {@link createCompatFilters}.
         * @param {Object} [filterValues] filterValues instance to base the new filterValues off of.
         */
        createFilterValues(filterValues) {
            const baseFilters = filterValues ? filterValues : new FilterValues();

            // Category (radio)
            if (this.filterRules.category.required.length > 0) {
                baseFilters.category = this.filterRules.category.required[0];
            } else if (Array.isArray(this.filterRules.category.allowed) && this.filterRules.category.allowed.length > 0) {
                baseFilters.category = this.filterRules.category.allowed[0];
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
            baseFilters.features = this.filterRules.features.required.length > 0 ? this.filterRules.features.required : this.filterRules.features.selected;

            // Senses (checkbox, all-of)
            baseFilters.anySense = this.filterRules.senses.required.length <= 0;
            baseFilters.senses = this.filterRules.senses.required.length > 0 ? this.filterRules.senses.required : this.filterRules.senses.selected;

            // Networks (checkbox, category !== hub ? any-of : all-of)
            if (baseFilters.category !== "hub" && Array.isArray(this.filterRules.networks.allowed) && this.filterRules.networks.allowed.length > 0) {
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

        // ConfirmCancelActionModal callback
        confirmCancel() {
            this.$eventBus.$emit("replace-device", null);
        },

        // Header action handling
        headerAction(target) {
            if (target === this.$options.name) {
                return;
            }

            if (this.replaceId) {
                this.$refs.confirmCancelActionModal.openModal(target);
            } else {
                this.$emit("change-view", target);
            }
        }
    },

    watch: {
        "filterValues.category": {
            handler(newCategory, oldCategory) {
                if (this.compatFiltersControl.value && (newCategory === "hub" || oldCategory === "hub")) {
                    this.filterValues.resetProperties("anyNetwork", "networks");
                    this.createFilterValues(this.filterValues);
                }
            }
        },

        "compatFiltersControl.value": {
            // We only want pre-selections to apply when the "compatibility filters" switch is on.
            // Conditional usage of the productsMap based on the switch for filtering products is realized inside the filteredProducts function.
            handler(newValue) {
                this.filterValues.resetAllProperties("category");
                if (newValue) {
                    this.createFilterValues(this.filterValues);
                }
            }
        }
    },

    beforeMount() {
        if (this.homeSetupEmpty) {
            this.compatFiltersControl = {
                value: false,
                disabled: true
            };
            return;
        }

        if (this.replaceId) {
            this.compatFiltersControl = {
                value: true,
                disabled: true
            };
        }

        this.createCompatFilters();
        this.createFilterValues();
    },

    mounted() {
        this.$root.activeViewRoot = this.$el;

        this.$eventBus.$on("header-click", this.headerAction);
    },

    beforeUnmount() {
        this.$eventBus.$off("header-click", this.headerAction);
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
