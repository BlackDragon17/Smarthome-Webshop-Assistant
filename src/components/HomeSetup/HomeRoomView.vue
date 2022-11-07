<template>
    <section ref="roomView" class="room-view">
        <AddRoomModal ref="addRoomModal" :room-view-state="viewState" :setup-rooms="currentSetup.rooms" @added-room="endAction"/>
        <RemoveRoomModal ref="removeRoomModal" :room-view-state="viewState" :current-setup="currentSetup" @removed-room="endAction"/>

        <h2 class="action-heading relative-centering" v-show="viewState !== 'normal'">{{ actionHeadingText }}</h2>

        <div class="room-grid-container">
            <div class="room-grid" :class="{'top-margin-override': viewState !== 'normal' && allowMarginOverride}">
                <Room v-for="room in currentSetup.rooms"
                      :key="room.name"
                      :style="positionRoom(room)"
                      :view-state="viewState"
                      :room="room"
                      :current-devices="currentSetup.devices"
                      :device-queue="deviceQueue"
                      @remove-room="removeSelectedRoom(room)"
                      @added-device="endAction"/>

                <button class="add-room-grid-button"
                        v-for="button in addRoomButtons"
                        :key="'' + button.location.x + button.location.y"
                        :style="positionButton(button)"
                        @click="addSelectedRoom(button)">
                    Click to add a<br>New Room<br>here
                </button>
            </div>
        </div>

        <div v-if="viewState === 'normal'" class="room-button-group relative-centering">
            <button class="add-room-button btn btn-primary" @click="addNewRoom">Add a new room</button>
            <button class="remove-room-button btn btn-secondary" @click="removeRoom">Remove a room</button>
        </div>
        <button v-else-if="viewState !== 'init'"
                class="cancel-button btn btn-danger relative-centering"
                @click="endAction">
            Cancel
        </button>
    </section>
</template>

<script>
import { nextTick } from "vue";

import AddRoomModal from "./modals/AddRoomModal.vue";
import RemoveRoomModal from "./modals/RemoveRoomModal.vue";
import Room from "./Room.vue";

export default {
    name: "HomeRoomView",

    components: {
        AddRoomModal,
        RemoveRoomModal,
        Room
    },

    data() {
        return {
            roomViewState: "init",

            gridStartCoord: 1,
            gridContainerCss: null,
            addRoomButtons: [],

            actionHeadingText: "Sample Text",
            actionHeadingHeight: {borderBox: 0, total: "0"},
            allowMarginOverride: true
        };
    },

    props: {
        currentSetup: Object,
        viewState: String,
        deviceQueue: Array
    },

    emits: ["change-state"],

    computed: {
        lowestCoords() {
            let lowestX = Infinity;
            let lowestY = Infinity;
            for (const room of this.currentSetup.rooms) {
                if (room.location.x < lowestX) {
                    lowestX = room.location.x;
                }
                if (room.location.y < lowestY) {
                    lowestY = room.location.y;
                }
            }
            return {x: lowestX, y: lowestY};
        },
        highestCoords() {
            let highestX = -Infinity;
            let highestY = -Infinity;
            for (const room of this.currentSetup.rooms) {
                if (room.location.x > highestX) {
                    highestX = room.location.x;
                }
                if (room.location.y > highestY) {
                    highestY = room.location.y;
                }
            }
            return {x: highestX, y: highestY};
        },

        gridWidth() {
            return this.lowestCoords.x === Infinity ? 0 : Math.abs(this.lowestCoords.x - this.highestCoords.x) + 1;
        },
        gridHeight() {
            return this.lowestCoords.y === Infinity ? 0 : Math.abs(this.lowestCoords.y - this.highestCoords.y) + 1;
        },


        cssGridColumns() {
            return this.gridStartCoord === 1 ? `repeat(${this.gridWidth}, minmax(15rem, 40rem))`
                : `repeat(${this.gridWidth + 2}, minmax(15rem, 40rem))`;
        },
        cssGridRows() {
            return this.gridStartCoord === 1 ? `repeat(${this.gridHeight}, minmax(10rem, 20rem))`
                : `repeat(${this.gridHeight + 2}, minmax(10rem, 20rem))`;
        },
        cssGridMinHeight() {
            let height = this.roomViewState === "adding-room" ? this.gridHeight + 2 : this.gridHeight;
            // rows + row gaps + margins
            return height * 10 + (height - 1) + 4 + "rem";
        },
        roomGridBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgreen";
        },
        roomGridContainerBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkorchid";
        }
    },

    methods: {
        positionRoom(room) {
            return `grid-column: ${room.location.x} / span 1; grid-row: ${room.location.y} / span 1;`;
        },
        positionButton(button) {
            return `grid-column: ${button.location.x} / span 1; grid-row: ${button.location.y} / span 1;`;
        },


        // Offset rooms' location to meet the grid's starting coordinate.
        shiftRoomCoords() {
            // On the x-axis
            if (this.lowestCoords.x < this.gridStartCoord) {
                const offset = Math.abs(this.lowestCoords.x - this.gridStartCoord);
                for (const room of this.currentSetup.rooms) {
                    room.location.x += offset;
                }
            } else if (this.lowestCoords.x > this.gridStartCoord) {
                const offset = Math.abs(this.gridStartCoord - this.lowestCoords.x);
                for (const room of this.currentSetup.rooms) {
                    room.location.x -= offset;
                }
            }

            // On the y-axis
            if (this.lowestCoords.y < this.gridStartCoord) {
                const offset = Math.abs(this.lowestCoords.y - this.gridStartCoord);
                for (const room of this.currentSetup.rooms) {
                    room.location.y += offset;
                }
            } else if (this.lowestCoords.y > this.gridStartCoord) {
                const offset = Math.abs(this.gridStartCoord - this.lowestCoords.y);
                for (const room of this.currentSetup.rooms) {
                    room.location.y -= offset;
                }
            }
        },

        createAddRoomButtons() {
            // Shift rooms by one to the bottom right to create room for add-buttons
            this.gridStartCoord = 2;
            this.shiftRoomCoords();

            // Create an array-based view of grid for button placement computation
            const roomGrid = [];
            for (let i = 1; i <= this.gridWidth + 2; i++) {
                const innerArr = [];
                for (let j = 1; j <= this.gridHeight + 2; j++) {
                    innerArr[j] = false;
                }
                roomGrid[i] = innerArr;
            }
            for (const room of this.currentSetup.rooms) {
                roomGrid[room.location.x][room.location.y] = true;
            }

            // Add buttons around rooms
            for (let i = 1; i <= this.gridWidth + 2; i++) {
                for (let j = 1; j <= this.gridHeight + 2; j++) {
                    // Check if current grid cell is a room (marked by true value)
                    if (roomGrid[i][j]) {
                        continue;
                    }
                    // Check if current cell is neighboring a room (CSS-style clockwise order)
                    if (roomGrid[i][j - 1] || roomGrid[i + 1]?.[j] || roomGrid[i][j + 1] || roomGrid[i - 1]?.[j]) {
                        if (!this.addRoomButtons.find(button => button.location.x === i && button.location.y === j)) {
                            this.addRoomButtons.push({location: {x: i, y: j}});
                        }
                    }
                }
            }
        },

        removeAddRoomButtons() {
            this.addRoomButtons = [];
            this.gridStartCoord = 1;
            this.shiftRoomCoords();
        },

        addSelectedRoom(button) {
            this.$refs.addRoomModal.openModal(button);
        },

        removeSelectedRoom(room) {
            this.$refs.removeRoomModal.openModal(room);
        },


        // Control button callbacks / action entry points

        addNewRoom() {
            this.createAddRoomButtons();

            this.actionHeadingText = "Select a spot to add the new room at:";
            this.$emit("change-state", "adding-room");
            this.checkHeaderOverflow();
        },

        removeRoom() {
            this.actionHeadingText = "Select a room to be removed:";
            this.$emit("change-state", "removing-room");
            this.checkHeaderOverflow();
        },

        moveDevice() {
            const device = this.deviceQueue[0];

            if (device.room === this.deviceTray) {
                this.actionHeadingText = "Select a spot to place the device at:";
            } else {
                this.actionHeadingText = "Select a spot to move the device to:";
            }
            this.$emit("change-state", "moving-device");
            this.checkHeaderOverflow();
        },

        addNewDevice() {
            this.actionHeadingText = "Select a spot to place the new device at:";
            this.$emit("change-state", "adding-device");
            this.checkHeaderOverflow();
        },

        // Cancel margin override if actionHeader would cover room-grid with it enabled
        async checkHeaderOverflow() {
            await nextTick();
            if (this.actionHeadingHeight.borderBox - 8 >= parseInt(this.gridContainerCss.getPropertyValue("margin-top"), 10)) {
                this.allowMarginOverride = false;
            }
        },

        endAction() {
            switch (this.viewState) {
                case "adding-room":
                    this.removeAddRoomButtons();
                    break;
                case "removing-room":
                    break;
                case "moving-device":
                    if (this.deviceQueue.length > 0) {
                        const device = this.deviceQueue.pop();
                        this.currentSetup.devices.push(device);
                    }
                    break;
                case "adding-device":
                    this.deviceQueue.pop();
                    break;
                default:
                    return;
            }

            this.$emit("change-state", "normal");
            this.actionHeadingText = "";
            this.allowMarginOverride = true;
        }
    },

    watch: {
        "currentSetup.rooms": {
            handler() {
                this.shiftRoomCoords();
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        this.$eventBus.$on("room-view-cancel", this.endAction);
        this.$eventBus.$on("move-device", this.moveDevice);
        this.$eventBus.$on("add-new-device", this.addNewDevice);

        // Compute actionHeadingHeight and hide it
        const heading = document.querySelector(".action-heading");
        this.actionHeadingHeight.borderBox = heading.offsetHeight;
        this.$emit("change-state", "normal");
        this.actionHeadingText = "";
        this.actionHeadingHeight.total = this.actionHeadingHeight.borderBox + parseInt(window.getComputedStyle(heading).getPropertyValue("margin-top"), 10);
        this.actionHeadingHeight.total += parseInt(window.getComputedStyle(heading).getPropertyValue("margin-bottom"), 10);
        this.actionHeadingHeight.total += "px";

        const gridContainer = document.querySelector(".room-grid-container");
        this.gridContainerCss = window.getComputedStyle(gridContainer);
    },

    beforeUnmount() {
        this.$eventBus.$off("room-view-cancel", this.endAction);
        this.$eventBus.$off("move-device", this.moveDevice);
        this.$eventBus.$off("add-new-device", this.addNewDevice);
    }
};
</script>

<style scoped>
/* Good info on how Flexbox centering makes overflowing items inaccessible via scrolling: */
/* https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container */
/* Basically the trick is to have a flex container but to center via margins instead of justify's within it. */

/* Page layout */

.room-view {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

/* Prevents the grid from overflowing .room-grid + allows it to have its own margins */
.room-grid-container {
    margin: auto;
    border: v-bind(roomGridContainerBorder);
    min-height: v-bind(cssGridMinHeight);
    display: flex;
}

/* Pushes the grid up to counter the offsetHeight of the actionHeading (while preserving a 2rem margin) */
/* Thus allowing the grid position to remain static given enough top margin */
.top-margin-override {
    margin-top: calc(2rem - v-bind("actionHeadingHeight.total")) !important;
}



/* Room grid styling */
.room-grid {
    margin: 2rem;
    border: v-bind(roomGridBorder);
    max-width: 90rem;
    max-height: 60rem;

    display: grid;
    grid-template-columns: v-bind(cssGridColumns);
    grid-template-rows: v-bind(cssGridRows);
    column-gap: 1rem;
    row-gap: 1rem;
}



/* Room grid buttons -- add room */

.add-room-grid-button {
    padding: 0;
    background-color: #f8faff;
    border: 1px solid #cde6ff;
}

.add-room-grid-button:hover, .add-room-grid-button:focus {
    background-color: #deeeff;
    border: 1px solid #42A5F5;
}

.add-room-grid-button:active {
    background-color: #96c8ef;
    border: 1px solid #0c88ed;
}



/* Control buttons */

button.btn {
    padding: 0.6rem 1rem;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}

.room-button-group {
    margin-top: 1rem;
    max-width: max-content;

    z-index: 1;
    position: sticky;
    bottom: 2rem;
}

.add-room-button {
    margin-right: 0.5rem;

    --bs-btn-bg: var(--blue-rooms-buttons);
    --bs-btn-hover-bg: var(--blue-rooms-buttons-darker1);
    --bs-btn-active-bg: var(--blue-rooms-buttons-darker2);
}

button.cancel-button {
    margin-top: 1rem;
    width: 9rem;

    z-index: 1;
    position: sticky;
    bottom: 2rem;
}



/* Action heading */
.action-heading {
    padding: 0.8rem 1.5rem 1rem;
    max-width: max-content;

    background-color: #FCFCFC;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.8rem;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);

    font-size: 1.55rem;
    text-align: center;

    z-index: 1;
    position: sticky;
    top: 1rem;
}
</style>
