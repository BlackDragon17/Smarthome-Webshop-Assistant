<template>
    <div class="room">
        <p class="room-title relative-centering">{{ room.name }}</p>

        <div class="device-grid">
            <div class="grid-cell" v-for="i in 9" :key="i" :style="alignGridCell(i)">
                <div class="device-flex" v-if="devicesArray[i].devices.length > 0 && !devicesArray[i].overflow">
                    <div class="device" v-for="device in devicesArray[i].devices" :key="device.localId">
                        {{ productsInRoom.find(product => product.productId === device.productId).brand }}
                    </div>
                </div>
                <div class="overflow-folder" v-else-if="devicesArray[i].devices.length > 0 && devicesArray[i].overflow">
                    Oh no an overflow :(
                </div>
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
export default {
    name: "Room",

    data() {
        return {
            devicesArray: []
        };
    },

    props: ["roomViewState", "room", "currentSetup", "productsInRoom"],

    emits: ["remove-room"],

    computed: {},

    methods: {
        alignGridCell(i) {
            switch (i) {
                case 1:
                    return "justify-self: start; align-self: start;";
                case 4:
                    return "justify-self: start; align-self: center;";
                case 5:
                    return "justify-self: center; align-self: center;";
                case 7:
                    return "justify-self: start; align-self: end;";
                case 9:
                    return "justify-self: end; align-self: end;";
            }
        },

        fillDevicesArray() {
            for (let i = 1; i <= 9; i++) {
                this.devicesArray[i] = {devices: [], overflow: false};
            }

            const devicesInRoom = this.currentSetup.products.filter(product => product.room === this.room.name);
            for (const device of devicesInRoom) {
                this.devicesArray[device.location].devices.push(device);
            }
        },

        printDebug() {
            if (this.room.name === "Living Room") {
            }
        }
    },

    beforeMount() {
        this.fillDevicesArray();
    },

    mounted() {
        this.$eventBus.$on("print-debug", this.printDebug);
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
    bottom: 0;

    margin-bottom: 0.1rem;
    color: var(--blue-room-text);
    font-size: 1.5rem;
}



/* Room room overlay */

.remove-room-overlay {
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;

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
    background-color: rgba(219, 21, 238, 0.2);

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
}

.grid-cell {

}

.device {
    width: 3rem;
    height: 3rem;

    background-color: bisque;
    border: 1px solid darkgreen;
    overflow: clip;
}
</style>
