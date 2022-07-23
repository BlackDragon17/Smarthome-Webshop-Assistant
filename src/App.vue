<template>
    <NavHeader ref="header" @header-click="headerAction"/>

    <main ref="app">
        <HomeSetup :current-setup="currentSetup"
                   :devices-by-type="devicesByType"
                   :devices-by-room="devicesByRoom"/>
    </main>
</template>

<script>
import { capitalize } from "vue";

import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";

// Data naming convention:
//     product: a unique smart home product model released by a company.
//     device: a device within a user's home setup.
//             In a setup there can be multiple devices which are the same product (same productId but different localId).
import allProducts from "/resources/products/packed/PackedJSONs.json";
import exampleSetup from "/src/assets/default_setups/example1.json";

export default {
    name: "App",

    components: {
        NavHeader,
        HomeSetup
    },

    data() {
        return {
            activeRootView: null,

            allProducts: allProducts.data,
            currentSetup: null
        };
    },

    provide() {
        return {
            allProducts: this.allProducts
        };
    },

    computed: {
        devicesByType() {
            const byType = {};
            for (const device of this.currentSetup.devices) {
                const type = capitalize(this.allProducts[device.productId].type) + "s";
                if (byType[type]) {
                    byType[type].push(device);
                } else {
                    byType[type] = [device];
                }
            }
            return byType;
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

        // productsByType() {
        //     const byType = {};
        //     for (const device of this.currentSetup.devices) {
        //         const type = capitalize(this.allProducts[device.productId].type) + "s";
        //         if (byType[type]) {
        //             byType[type].push(this.allProducts[device.productId]);
        //         } else {
        //             byType[type] = [this.allProducts[device.productId]];
        //         }
        //     }
        //     return byType;
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
            const rooms = [];
            for (const room of setup.rooms) {
                if (room.name && room.location) {
                    rooms.push(room);
                }
            }

            const devices = [];
            for (const device of setup.devices) {
                if (device.productId && device.localId && device.room && device.location
                    && rooms.find(room => room.name === device.room)) {
                    devices.push(device);
                }
            }

            this.currentSetup = {rooms, devices};
        },

        headerAction(target) {
            //TODO: Switch page
            console.log("Header target:", target);
            this.$eventBus.$emit("focus-home-setup");
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
    border-radius: 0.5rem;
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

    --gray-button-hover: #DFDFDF;
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
