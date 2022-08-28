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
import exampleSetup from "/src/assets/default_setups/example1.json";

// TODO: Notes:
// - when initially loading a setup, App.vue should generate appropriate filters
//     - these would be the basic always-on filters regarding the whole setup
// - when selecting a device to replace, an event with the productId shall be sent.
//   App.vue will create the appropriate filters and switch to the database
// - the filters should additionally contain the ID in a "replacementFor" field, which's existence will alter UI behavior
//     - if the user tries to switch back to home setup before a replacement is chosen, a cancel-confirmation modal shall pop up
// - when a device requires a hub add-on (regardless of mode), a modal with that info shall pop up
//     - entering hub selection mode shall be implemented in the same way as device replacement, including UI behavior
// - we will need to update HomeRoomView.vue et al to add a device and its hub as if it were one from the queue

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
            deviceQueue: []
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
        // Check integrity of given setup and load it
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

        async getNewProduct(product) {
            this.deviceQueue = [product];
            this.changeView("HomeSetup");
            await nextTick();
            this.$eventBus.$emit("add-new-device");
        }
    },

    beforeMount() {
        this.checkAndLoadSetup(exampleSetup);
    },

    mounted() {
        // Set the height of the Main content to 100vh - headerHeight
        let headerHeight = this.$refs.header.$el.offsetHeight;
        this.$refs.app.style.height = `calc(100vh - ${headerHeight}px)`;
        this.$refs.app.style.maxHeight = `calc(100vh - ${headerHeight}px)`;

        this.$eventBus.$on("change-view", this.changeView);
        this.$eventBus.$on("get-new-product", this.getNewProduct);
    },

    beforeUnmount() {
        this.$eventBus.$off("change-view", this.changeView);
        this.$eventBus.$off("get-new-product", this.getNewProduct);
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
