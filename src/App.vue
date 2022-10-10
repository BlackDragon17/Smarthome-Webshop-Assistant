<template>
    <NavHeader ref="header" :active-view="activeView"/>

    <main ref="app">
        <HomeSetup v-if="activeView === 'HomeSetup'"
                   :current-setup="currentSetup"
                   :devices-by-category="devicesByCategory"
                   :devices-by-room="devicesByRoom"
                   :device-queue="deviceQueue"
                   @change-view="changeView"/>

        <ProductDatabase v-else-if="activeView === 'ProductDatabase'"
                         :current-setup="currentSetup"
                         :setup-products="setupProducts"
                         :replace-id="replaceId"
                         @change-view="changeView"/>
    </main>
</template>

<script>
import { nextTick } from "vue";
import Device from "@/assets/javascript/device";
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";
import ProductDatabase from "./components/ProductDatabase/ProductDatabase.vue";

// Data naming convention:
//     product: a unique smart home product model released by a company.
//     device: a device within a user's home setup.
//             In a setup there can be multiple devices which are the same product (same productId but different localId).
import allProducts from "/resources/products/packed/PackedJSONs.json";
import example1 from "/src/assets/default_setups/example1.json";
import dfki from "/src/assets/default_setups/dfki.json";

const defaultSetups = {
    example1,
    dfki
};

// TODO:
// - add bars-like compatScore display to Product
// - add control-selection UI to HomeSetup
// - add action completion toast for at least device replacement
// - add more products
// - add purchase buttons to products
// - translate App
// - add user-customizable product sorting to DatabaseProductView

export default {
    name: "App",

    components: {
        NavHeader,
        HomeSetup,
        ProductDatabase
    },

    data() {
        return {
            activeView: "ProductDatabase",
            activeViewRoot: null,

            allProducts: allProducts.data,
            currentSetup: null,
            deviceQueue: [],
            replaceId: null
        };
    },

    provide() {
        return {
            allProducts: this.allProducts
        };
    },

    emits: ["add-new-device"],

    computed: {
        devicesByCategory() {
            const byCategory = {};
            for (const device of this.currentSetup.devices) {
                const category = this.$getName.categoryHeading(this.allProducts[device.productId].category);
                if (byCategory[category]) {
                    byCategory[category].push(device);
                } else {
                    byCategory[category] = [device];
                }
            }
            return byCategory;
        },
        devicesByRoom() {
            const byRoom = {};
            for (const device of this.currentSetup.devices) {
                if (byRoom[device.room]) {
                    byRoom[device.room].push(device);
                } else {
                    byRoom[device.room] = [device];
                }
            }
            return byRoom;
        },

        setupProducts() {
            const products = [];
            for (const device of this.currentSetup.devices) {
                if (!products.find(product => product.productId === device.productId)) {
                    products.push(this.allProducts[device.productId]);
                }
            }
            return products;
        }

        // productsByCategory() {
        //     const byCategory = {};
        //     for (const device of this.currentSetup.devices) {
        //         const category = this.$getName.categoryHeading(this.allProducts[device.productId].category);
        //         if (byCategory[category]) {
        //             byCategory[category].push(this.allProducts[device.productId]);
        //         } else {
        //             byCategory[category] = [this.allProducts[device.productId]];
        //         }
        //     }
        //     return byCategory;
        // },
        // productsByRoom() {
        //     const byRoom = {};
        //     for (const device of this.currentSetup.devices) {
        //         if (byRoom[device.room]) {
        //             byRoom[device.room].push(this.allProducts[device.productId]);
        //         } else {
        //             byRoom[device.room] = [this.allProducts[device.productId]];
        //         }
        //     }
        //     return byRoom;
        // }
    },

    methods: {
        /**
         * If URL contains a "setup" search param, tries to load that setup.
         * Otherwise, loads "example1.json" default setup.
         * This method only initiates the loading process defined in {@link checkAndLoadSetup}.
         */
        parseUrlQuery() {
            const searchParams = new URLSearchParams(window.location.search);
            const setupParam = searchParams.get("setup");
            if (setupParam && Object.keys(defaultSetups).includes(setupParam)) {
                this.checkAndLoadSetup(defaultSetups[setupParam]);
            } else {
                this.checkAndLoadSetup(example1);
            }

        },

        /**
         * Checks integrity of given setup and loads it.
         * @param setup {Object} setup to load.
         */
        checkAndLoadSetup(setup) {
            const controls = {};
            if (setup.controls.brandApps?.length > 0) {
                controls.brandApps = setup.controls.brandApps;
            }
            if (setup.controls.assistants?.length > 0) {
                controls.assistants = setup.controls.assistants;
            }

            const rooms = [];
            for (const room of setup.rooms) {
                if (room.name && room.location) {
                    rooms.push(room);
                }
            }

            const devices = [];
            for (const device of setup.devices) {
                if (device.productId && device.localId && device.room && device.location
                    && (rooms.find(room => room.name === device.room) || device.room === this.deviceTray)) {
                    devices.push(Device.createFromJson(device));
                }
            }

            this.currentSetup = {controls, rooms, devices};
        },

        changeView(target) {
            this.activeView = target;
        },


        // Inter-view action handlers

        /**
         * Called by ProductDatabase, adds the given product to the HomeSetup.
         */
        async getNewProduct(product) {
            this.deviceQueue = [product];
            this.changeView("HomeSetup");
            await nextTick();
            this.$eventBus.$emit("add-new-device");
        },

        /**
         * Called by HomeSetup, begins the process of finding a replacement for the given device in the ProductDatabase.
         */
        async getReplacement(device) {
            const deviceIndex = this.currentSetup.devices.findIndex(setupDevice => setupDevice.localId === device.localId);
            this.currentSetup.devices.splice(deviceIndex, 1);
            this.deviceQueue = [device];
            this.replaceId = device.productId;

            this.changeView("ProductDatabase");
            await nextTick();
            this.$eventBus.$emit("replace-product");
        },

        /**
         * Called by ProductDatabase, adds the chosen product as a replacement for the previous device to the HomeSetup.
         */
        async replaceDevice(product) {
            if (!product) {
                this.currentSetup.devices.push(this.deviceQueue.pop());
                this.replaceId = null;

                this.changeView("HomeSetup");
            } else {
                const oldDevice = this.deviceQueue.pop();
                const newDevice = Device.createFromDTO(product, oldDevice.room, oldDevice.location);
                this.currentSetup.devices.push(newDevice);
                this.replaceId = null;

                this.changeView("HomeSetup");
            }
        }
    },

    beforeMount() {
        this.parseUrlQuery();
    },

    mounted() {
        // Set the height of the Main content to 100vh - headerHeight
        let headerHeight = this.$refs.header.$el.offsetHeight;
        this.$refs.app.style.height = `calc(100vh - ${headerHeight}px)`;
        this.$refs.app.style.maxHeight = `calc(100vh - ${headerHeight}px)`;

        this.$eventBus.$on("change-view", this.changeView);
        this.$eventBus.$on("get-new-product", this.getNewProduct);
        this.$eventBus.$on("get-replacement", this.getReplacement);
        this.$eventBus.$on("replace-device", this.replaceDevice);
    },

    beforeUnmount() {
        this.$eventBus.$off("change-view", this.changeView);
        this.$eventBus.$off("get-new-product", this.getNewProduct);
        this.$eventBus.$off("get-replacement", this.getReplacement);
        this.$eventBus.$off("replace-device", this.replaceDevice);
    }
};
</script>

<style>
/* Override and set default styles */

body {
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Ubuntu, "Open Sans", sans-serif;
    line-height: 1.4;
}

ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
}

p {
    margin: 0;
}

.btn {
    border: none;
    border-radius: var(--button-border-radius);
    font-weight: 600;
}



/* Globally available styles */

:root {
    --nav-header-bg: #FAFAFA;
    --blue-logo: #1A73E8;

    --blue-rooms-devices: #42A5F5;
    --blue-rooms-buttons: #2A99F4;
    --blue-rooms-buttons-darker1: #0C80DF; /* lightness -10 */
    --blue-rooms-buttons-darker2: #0964AE; /* lightness -20 */

    --blue-room-background: #E3F2FD;
    --blue-room-border: #9ACFF9;
    --blue-room-text: #1866BF;

    --green-devices-main: #4CAF50;
    --green-devices-main-darker1: #439846; /* lightness -6 */
    --green-devices-main-darker2: #38803A; /* lightness -13 */

    --green-devices-overlay: #44A148;

    --gray-button-hover: #DFDFDF;

    --button-border-radius: 0.5rem;
}

/* *:focus { */
/*     outline: 3px solid red !important; */
/* } */

.box {
    height: 100px;
    margin: 10px;
    background-color: lightgray;
    border: 1px solid darkgray;
}

.radio-btn {
    box-shadow: none !important;
    border: 1px solid var(--bs-btn-border-color);
}

.inline-icon {
    vertical-align: bottom;
    font-size: 1.4em;
}

.align-text {
    margin-bottom: 0.1em;
}

.relative-centering {
    /* https://www.w3.org/Style/Examples/007/center.en.html#hv3 */
    left: 50%;
    margin-right: -50%;
    transform: translateX(-50%);
}

.hidden {
    visibility: hidden;
}
</style>
