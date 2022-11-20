<template>
    <NavHeader ref="header" :active-view="activeView"/>

    <TaskCompleteModal ref="taskCompleteModal" v-if="currentSetup?.studySetup"/>

    <main ref="app">
        <HomeSetup v-if="activeView === 'HomeSetup'"
                   ref="homeSetup"
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

    <TutorialTooltips v-if="showTutorial" :active-view="activeView"/>
    <TutorialTooltip/>
    <Alerts :study-setup="this.currentSetup?.studySetup"/>
</template>

<script>
import { nextTick } from "vue";
import { mapState } from "pinia";
import { useProductsStore } from "@/stores/products-store";
import Device from "@/assets/javascript/dto/device";
import Events from "@/assets/javascript/events";
import NavHeader from "@/components/NavHeader.vue";
import HomeSetup from "@/components/HomeSetup/HomeSetup.vue";
import ProductDatabase from "@/components/ProductDatabase/ProductDatabase.vue";
import TaskCompleteModal from "@/components/TaskCompleteModal.vue";
import TutorialTooltips from "@/components/TutorialTooltips.vue";
import TutorialTooltip from "@/components/TutorialTooltip.vue";
import Alerts from "@/components/Alerts.vue";

const defaultView = "HomeSetup";

export default {
    name: "App",

    components: {
        NavHeader,
        HomeSetup,
        ProductDatabase,
        TaskCompleteModal,
        TutorialTooltips,
        TutorialTooltip,
        Alerts
    },

    data() {
        return {
            activeView: null,
            activeViewRoot: null,

            currentSetup: null,
            deviceQueue: [],
            replaceId: null,

            initialControlsTooltipShown: false,
            tutorialShown: false
        };
    },

    emits: [Events.ADD_NEW_DEVICE, Events.VIEW_CHANGED],

    computed: {
        ...mapState(useProductsStore, ["allProducts"]),

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
        },

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

        showTutorial() {
            return this.currentSetup?.studySetup && this.currentSetup?.name.includes("0") && !this.tutorialShown;
        }
    },

    methods: {
        /**
         * If URL contains a valid "setup" search param, tries to load that setup.
         * Otherwise, loads "example1.json" default setup.
         * This method only initiates the loading process defined in {@link checkAndLoadSetup}.
         */
        async parseUrlQuery() {
            const searchParams = new URLSearchParams(window.location.search);
            let setupParam = searchParams.get("setup") || "example1";
            let setup = null;
            try {
                setup = await import(`./assets/default_setups/${setupParam}.json`);
                if (setup == null) {
                    throw new Error("Imported setup is empty, falling back to example1.");
                }
            } catch (e) {
                setupParam = "example1";
                setup = await import(`./assets/default_setups/${setupParam}.json`);
            }
            this.checkAndLoadSetup(setup, setupParam);
        },

        /**
         * Checks integrity of given setup and saves it to the shared variable.
         *
         * @param {Object} setup setup to load.
         * @param {string} name name to attach to loaded setup.
         */
        checkAndLoadSetup(setup, name) {
            const controls = {
                assistants: [],
                brandApps: []
            };
            if (Array.isArray(setup.controls.assistants) && setup.controls.assistants.length > 0) {
                controls.assistants = setup.controls.assistants.filter(assistant => Object.keys(this.$getName.allAssistants).includes(assistant));
            }
            if (Array.isArray(setup.controls.brandApps) && setup.controls.brandApps.length > 0) {
                controls.brandApps = setup.controls.brandApps.filter(brandApp => brandApp && typeof brandApp === "string");
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

            this.currentSetup = {controls, rooms, devices, name};
            if (name.includes("study-task")) {
                this.currentSetup.studySetup = true;
            }

            this.activeView = defaultView;
        },


        // Inter-view action handlers

        async changeView(target) {
            this.activeView = target;
            await nextTick();
            this.$eventBus.$emit(Events.VIEW_CHANGED, target);
        },

        /**
         * Called by ProductDatabase, adds the given product to the HomeSetup.
         */
        async getNewProduct(product) {
            this.deviceQueue = [product];
            await this.changeView("HomeSetup");
            this.$eventBus.$emit(Events.ADD_NEW_DEVICE);
        },

        /**
         * Called by HomeSetup, begins the process of finding a replacement for the given device in the ProductDatabase.
         */
        async getReplacement(device) {
            const deviceIndex = this.currentSetup.devices.findIndex(setupDevice => setupDevice.localId === device.localId);
            this.currentSetup.devices.splice(deviceIndex, 1);
            this.deviceQueue = [device];
            this.replaceId = device.productId;

            await this.changeView("ProductDatabase");
        },

        /**
         * Called by ProductDatabase, adds the chosen product as a replacement for the previous device to the HomeSetup.
         */
        async replaceDevice(product) {
            if (!product) {
                this.currentSetup.devices.push(this.deviceQueue.pop());
                this.replaceId = null;

                await this.changeView("HomeSetup");
            } else {
                const oldDevice = this.deviceQueue.pop();
                const newDevice = Device.createFromDTO(product, oldDevice.room, oldDevice.location);
                this.currentSetup.devices.push(newDevice);
                this.replaceId = null;

                await this.changeView("HomeSetup");
            }
        },

        /**
         * Opens the TaskCompleteModal, built for the online survey.
         * @param {string} [postMsg] the message to post to a parent window. No message is posted if left undefined or there's no parent window.
         */
        openTaskCompleteModal(postMsg) {
            if (this.currentSetup.studySetup) {
                this.$refs.taskCompleteModal.openModal(postMsg);
            }
        },


        async checkSetupState(currentSetup) {
            await nextTick();
            if (this.activeView !== "HomeSetup" || this.$refs.homeSetup?.viewState !== "normal") {
                return;
            }
            console.log("App: setup changed");

            const sharedVars = {
                philipsHueBridgeLocalId: "c0bad215-c7d5-41f7-8ef5-3ab127350694",
                oldLampLocalId: "abf33fec-1753-41f3-bec6-12a7de40a918"
            };

            const taskNumber = currentSetup.name.match(/\d/)?.[0];

            let success = false;
            switch (taskNumber) {
                case "1":
                    success = this.checkTask1Success(currentSetup, sharedVars);
                    break;
                case "2":
                    success = this.checkTask2Success(currentSetup, sharedVars);
                    break;
                case "3":
                    success = this.checkTask3Success(currentSetup);
                    break;
                case "4":
                    success = this.checkTask4Success();
                    break;
            }

            if (success) {
                console.log(`Task ${taskNumber} successful.`);
                this.openTaskCompleteModal(Events.TASK_SUCCESSFUL);
            }
        },

        checkTask1Success(currentSetup, sharedVars) {
            return currentSetup.devices.find(device => device.room === "Bedroom" && device.location === 1
                && device.localId !== sharedVars.oldLampLocalId
                && this.allProducts[device.productId].category === "light");
        },
        checkTask2Success(currentSetup) {
            const foyerDevice = currentSetup.devices.find(device => device.room === "Foyer");
            const foyerProduct = foyerDevice ? this.allProducts[foyerDevice.productId] : null;

            return foyerProduct
                && foyerProduct.category === "sensor"
                && foyerProduct.senses.includes("motion")
                && (foyerProduct.network.zigbee || foyerProduct.network.lan);
        },
        checkTask3Success(currentSetup) {
            return currentSetup.devices.filter((device) => {
                const product = this.allProducts[device.productId];
                return product.category === "light" || product.category === "switch" || product.category.includes("switch");
            }).length >= 3;
        },
        checkTask4Success() {
            return false;
        }
    },

    beforeCreate() {
        useProductsStore().initStore();
    },

    async created() {
        await this.parseUrlQuery();
        this.$permissions.init(this.currentSetup.name, this.currentSetup.studySetup, this.$eventBus, this.allProducts);

        // Online study-specific code
        if (!this.currentSetup.studySetup) {
            return;
        }
        if (!this.currentSetup.name.includes("0")) {
            this.$watch("currentSetup", this.checkSetupState, {deep: true, flush: "post"});
        }

        if (!(window !== window.parent)) {
            return;
        }
        window.addEventListener("message", (event) => {
            if (event.origin !== "https://umtlstudies.dfki.de") {
                return;
            }
            if (event.data === Events.TASK_FAILED) {
                this.openTaskCompleteModal();
            } else if (event.data === Events.RESET_STATE) {
                location.reload();
            }
        });
    },

    mounted() {
        // Set the height of the Main content to 100vh - headerHeight
        let headerHeight = this.$refs.header.$el.offsetHeight;
        this.$refs.app.style.height = `calc(100vh - ${headerHeight}px)`;
        this.$refs.app.style.maxHeight = `calc(100vh - ${headerHeight}px)`;

        this.$eventBus.$on(Events.CHANGE_VIEW, this.changeView);
        this.$eventBus.$on(Events.GET_NEW_PRODUCT, this.getNewProduct);
        this.$eventBus.$on(Events.GET_REPLACEMENT, this.getReplacement);
        this.$eventBus.$on(Events.REPLACE_DEVICE, this.replaceDevice);
    },

    beforeUnmount() {
        this.$eventBus.$off(Events.CHANGE_VIEW, this.changeView);
        this.$eventBus.$off(Events.GET_NEW_PRODUCT, this.getNewProduct);
        this.$eventBus.$off(Events.GET_REPLACEMENT, this.getReplacement);
        this.$eventBus.$off(Events.REPLACE_DEVICE, this.replaceDevice);
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
    --green-devices-main-darker3: #285C2A; /* lightness -23 */
    --green-devices-main-darker4: #1C401D; /* lightness -31 */

    --green-devices-overlay: #44A148;

    --green-tooltip-bg: #4EB151;
    --green-tooltip-border: #46A049;

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
