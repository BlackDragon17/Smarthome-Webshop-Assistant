<template>
    <div class="room" ref="roomEl">
        <p class="room-title relative-centering" :style="cssAlignTitle">{{ room.name }}</p>

        <div class="device-grid">
            <div class="grid-cell" v-for="i in 9" :key="i" :ref="el => cellArray[i].element = el">
                <div class="device-flex" v-if="cellArray[i].devices.length > 0" :class="{hidden: cellArray[i].overflow}" :style="alignGridFlex(i)">
                    <button class="device" v-for="device in cellArray[i].devices" :key="device.localId">
                        <span class="device-icon material-symbols-rounded">
                            {{ getDeviceIcon(productsInRoom.find(product => product.productId === device.productId).type) }}
                        </span>
                    </button>
                </div>
                <Dropdown v-if="room.name !== 'Bedroom' && cellArray[i].overflow" class="overflow-dropdown" :style="alignGridAbsolute(i)">
                    <button class="device overflow-button">
                        <span class="align-text">
                            +{{ cellArray[i].devices.length }}
                        </span>
                    </button>
                    <template #popper>
                        <div class="overflow-device-flex" :style="{maxWidth: cssPopoverMaxWidth}">
                            <button class="device" v-for="device in cellArray[i].devices" :key="device.localId + 'overflow'">
                                <span class="device-icon material-symbols-rounded">
                                    {{ getDeviceIcon(productsInRoom.find(product => product.productId === device.productId).type) }}
                                </span>
                            </button>
                        </div>
                    </template>
                </Dropdown>

                <Popover v-else-if="cellArray[i].overflow" class="overflow-dropdown" :style="alignGridAbsolute(i)">
                    <button class="device overflow-button">
                        <span class="align-text">
                            +{{ cellArray[i].devices.length }}
                        </span>
                    </button>
                    <template #popover>
                        <div class="overflow-device-flex">
                            <button class="device" v-for="device in cellArray[i].devices" :key="device.localId + 'overflow'">
                                <span class="device-icon material-symbols-rounded">
                                    {{ getDeviceIcon(productsInRoom.find(product => product.productId === device.productId).type) }}
                                </span>
                            </button>
                        </div>
                    </template>
                </Popover>
            </div>
        </div>

        <button class="remove-room-overlay" v-if="roomViewState === 'removing-room'" @click="$emit('remove-room')">
            <span class="remove-room-icon-bg">
                <span class="remove-room-icon material-symbols-rounded">delete</span>
            </span>
        </button>
    </div>
</template>

<script>
import { Dropdown } from "floating-vue";
import Popover from "../Popover.vue";

export default {
    name: "Room",

    components: {
        Popover,
        Dropdown
    },

    data() {
        return {
            cellArray: [],
            resizeObserver: null
        };
    },

    props: {
        roomViewState: String,
        room: Object,
        currentSetup: Object,
        productsInRoom: Array
    },

    emits: ["remove-room"],

    computed: {
        cssAlignTitle() {
            if (this.cellArray[8].devices.length <= 0) {
                return "bottom: 0; margin-bottom: 0.1rem;";
            }
            if (this.cellArray[2].devices.length <= 0) {
                return "top: 0;";
            }
            if (this.cellArray[5].devices.length <= 0) {
                return "top: 50%; transform: translate(-50%, -50%);";
            }
            return "bottom: 3rem; margin-bottom: 0.1rem;";
        },
        cssPopoverMaxWidth() {
            return `calc(${this.$refs.roomEl.offsetWidth}px / 1.3)`;
        }
    },

    methods: {
        getDeviceIcon(deviceType) {
            switch (deviceType) {
                case "light":
                    return "lightbulb";
                case "hub":
                    return "hub";
                case "sensor":
                    return "sensors";
            }
        },

        // Margin-based positioning between grid-cell & device-flex (makes overflows work properly)
        // Flexbox-based positioning between device-flex & device (centers items in case of wrap)
        alignGridFlex(i) {
            switch (i) {
                case 1:
                    return "margin: 0 auto auto 0; justify-content: flex-start;";
                case 2:
                    return "margin: 0 auto auto auto; justify-content: center;";
                case 3:
                    return "margin: 0 0 auto auto; justify-content: flex-end;";
                case 4:
                    return "margin: auto auto auto 0; justify-content: flex-start;";
                case 5:
                    return "margin: auto; justify-content: center;";
                case 6:
                    return "margin: auto 0 auto auto; justify-content: flex-end;";
                case 7:
                    return "margin: auto auto 0 0; justify-content: flex-start; flex-wrap: wrap-reverse;";
                case 8:
                    return "margin: auto auto 0 auto; justify-content: center; flex-wrap: wrap-reverse;";
                case 9:
                    return "margin: auto 0 0 auto; justify-content: end; flex-wrap: wrap-reverse;";
            }
        },
        alignGridAbsolute(i) {
            switch (i) {
                case 1:
                    return "top: 0; left: 0;";
                case 2:
                    return "top: 0; left: 50%; transform: translateX(-50%);";
                case 3:
                    return "top: 0; right: 0;";
                case 4:
                    return "top: 50%; transform: translateY(-50%); left: 0;";
                case 5:
                    return "top: 50%; left: 50%; transform: translate(-50%, -50%);";
                case 6:
                    return "top: 50%; transform: translateY(-50%); right: 0;";
                case 7:
                    return "bottom: 0; left: 0;";
                case 8:
                    return "bottom: 0; left: 50%; transform: translateX(-50%);";
                case 9:
                    return "bottom: 0; right: 0;";
            }
        },

        // If, in template and script, we accessed cellArray via `cell of cellArray`, we'd need each cell to carry an ID prop (for devices and refs).
        // Thus, we instead use "implicit identification" via array position, even if that means that it has to start with 1 due to v-for-range syntax.
        initCellArray() {
            for (let i = 1; i <= 9; i++) {
                this.cellArray[i] = {devices: [], overflow: false, element: null};
            }

            const devicesInRoom = this.currentSetup.products.filter(product => product.room === this.room.name);
            for (const device of devicesInRoom) {
                this.cellArray[device.location].devices.push(device);
            }
        },

        checkCellOverflow() {
            for (let i = 1; i <= 9; i++) {
                if (this.cellArray[i].devices.length > 1
                    && this.cellArray[i].element.scrollHeight - this.cellArray[i].element.offsetHeight > 2) {
                    this.cellArray[i].overflow = true;
                } else if (this.cellArray[i].devices.length <= 1
                    // Not a simple `else` to prevent flickering
                    || this.cellArray[i].element.scrollHeight - this.cellArray[i].element.offsetHeight < 1) {
                    this.cellArray[i].overflow = false;
                }
            }
        },

        printDebug() {
            if (this.room.name === "Bedroom") {
                const cellNr = 7;
                console.log("cell", this.cellArray[cellNr].element);
                console.log("cell height", this.cellArray[cellNr].element.offsetHeight);
                console.log("cell scr height", this.cellArray[cellNr].element.scrollHeight);
            }
        }
    },

    beforeMount() {
        this.initCellArray();
    },

    mounted() {
        this.$eventBus.$on("print-debug", this.printDebug);

        this.resizeObserver = new ResizeObserver(() => this.checkCellOverflow());
        this.resizeObserver.observe(this.$refs.roomEl);
    },

    beforeUnmount() {
        this.$eventBus.$off("print-debug", this.printDebug);
    }
};
</script>

<style scoped>
/* Room styling */

.room {
    background-color: var(--blue-room-background);
    border: 1px solid var(--blue-room-border);

    position: relative;
}

.room > .room-title {
    position: absolute;

    color: var(--blue-room-text);
    font-size: 1.5rem;
}



/* Remove room overlay */

.remove-room-overlay {
    width: 100%;
    height: 100%;
    border: none;
    background: none;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0;
}

.remove-room-overlay:hover, .remove-room-overlay:focus {
    border: 1px solid var(--bs-red);
    background-color: rgba(255, 0, 0, 0.3);
}

.remove-room-overlay:active {
    background-color: rgba(255, 0, 0, 0.5);
}

.remove-room-icon-bg {
    width: 4rem;
    height: 4rem;
    border-radius: 0.3rem;
    background-color: var(--bs-red);

    display: flex;
    justify-content: center;
    align-items: center;
}

.remove-room-icon {
    color: white;
    font-size: 3rem;
    font-weight: 600;
}



/* Device grid styling */

.device-grid {
    width: 100%;
    height: 100%;
    /* background-color: rgba(219, 21, 238, 0.2); */

    display: grid;
    grid-template-columns: repeat(3, calc(100% / 3));
    grid-template-rows: repeat(3, calc(100% / 3));
}

.grid-cell {
    overflow: hidden;
    display: flex;

    position: relative;
}



/* Device styling */

.device-flex {
    display: flex;
    flex-wrap: wrap;
}

.device {
    margin: 2px;
    width: 3rem;
    height: 3rem;

    border: none;
    border-radius: 0.2rem;
    background-color: var(--blue-rooms-devices);
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: clip;
}

.device:hover, .device:focus {
    background-color: var(--blue-rooms-buttons-darker1);
}

.device:active {
    background-color: var(--blue-rooms-buttons-darker2);
}

.device-icon {
    font-size: 1.7rem;
    font-variation-settings: "GRAD" 100;
}



/* Overflow styling */

.overflow-dropdown {
    margin: 3px 5px 5px 3px;
    position: absolute;
}

.overflow-button {
    margin: 0;
    box-shadow: 0.2rem 0.2rem var(--blue-rooms-buttons-darker1);
    font-size: 1.1em;
    font-weight: 600;
}

.overflow-device-flex {
    margin: 0.25rem;
    display: flex;
    flex-wrap: wrap;
}
</style>
