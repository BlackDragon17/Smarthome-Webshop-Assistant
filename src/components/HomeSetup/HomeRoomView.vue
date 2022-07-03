<template>
    <section class="room-view" :class="{'room-view-padding-override': false}">
        <AddRoomModal ref="addRoomModal" :setup-rooms="currentSetup.rooms" :room-view-state="roomViewState" @room-added="endAction"/>

        <h3 class="action-heading" v-show="roomViewState !== 'normal'">{{ actionHeadingText }}</h3>

        <div class="room-grid-container">
            <div class="room-grid">
                <div class="room" v-for="room in currentSetup.rooms" :key="room.name" :style="positionRoom(room)">
                    <p class="room-title">{{ room.name }}</p>
                    <div v-if="roomViewState === 'removing-room'" class="remove-overlay">
                        <button class="remove-room-grid-button">Remove room</button>
                    </div>
                </div>

                <button class="add-room-grid-button"
                        v-for="button in addRoomButtons"
                        :key="'' + button.location.x + button.location.y"
                        :style="positionButton(button)"
                        @click="addSelectedRoom(button)">
                    Click to add a<br>New Room<br>here
                </button>
            </div>
        </div>
        <button v-if="false" @click="printDebug">Debug</button>

        <div class="buttons-spacer"></div>
        <div v-if="roomViewState === 'normal'" class="room-button-group">
            <button class="add-room-button btn btn-primary" @click="addNewRoom">Add a new room</button>
            <button class="remove-room-button btn btn-secondary" @click="removeRoom">Remove a room</button>
        </div>
        <button v-else-if="roomViewState !== 'adding-device'" class="cancel-button btn btn-danger" @click="endAction">Cancel</button>
    </section>
</template>

<script>
import AddRoomModal from "./AddRoomModal.vue";

export default {
    name: "HomeRoomView",

    components: {
        AddRoomModal
    },

    data() {
        return {
            roomViewState: "init",
            actionHeadingText: "Sample Text",

            gridStartCoord: 1,
            addRoomButtons: [],

            actionHeadingHeight: 0
        };
    },

    props: ["currentSetup"],

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
            return Math.abs(this.lowestCoords.x - this.highestCoords.x) + 1;
        },

        gridHeight() {
            return Math.abs(this.lowestCoords.y - this.highestCoords.y) + 1;
        },


        cssGridColumns() {
            return this.gridStartCoord === 1 ? `repeat(${this.gridWidth}, minmax(10rem, 40rem))`
                : `repeat(${this.gridWidth + 2}, minmax(10rem, 40rem))`;
        },

        cssGridRows() {
            return this.gridStartCoord === 1 ? `repeat(${this.gridHeight}, minmax(10rem, 20rem))`
                : `repeat(${this.gridHeight + 2}, minmax(10rem, 20rem))`;
        },

        roomGridBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgreen";
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
            console.log("Shifting room coords");
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

            // Create an array-based view of grid button placement computation
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


        addNewRoom() {
            this.createAddRoomButtons();
            this.actionHeadingText = "Select a spot to add the new room:";
            this.roomViewState = "adding-room";
            this.$eventBus.$emit("room-view-busy");
            this.$eventBus.$emit("focus-home-setup");
        },

        removeRoom() {
            this.actionHeadingText = "Select a room to be removed:";
            this.roomViewState = "removing-room";
            this.$eventBus.$emit("room-view-busy");
            this.$eventBus.$emit("focus-home-setup");
        },

        endAction() {
            switch (this.roomViewState) {
                case "adding-room":
                    this.removeAddRoomButtons();
                    break;
                case "removing-room":
                    break;
            }

            this.roomViewState = "normal";
            this.actionHeadingText = "";
            this.$eventBus.$emit("room-view-free");
        },


        printDebug() {
            console.log("grid dim:", this.gridWidth, this.gridHeight);
            console.log("lowest coords:", this.lowestCoords);
            console.log("highest coords:", this.highestCoords);
            console.log("grid start:", this.gridStartCoord);
            console.log("css col:", this.cssGridColumns);
        }
    },

    watch: {
        currentSetup: {
            handler() {
                this.shiftRoomCoords();
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        this.$eventBus.$on("room-view-cancel", this.endAction);

        const heading = document.querySelector(".action-heading");
        let headingHeight = heading.offsetHeight;
        this.roomViewState = "normal";
        this.actionHeadingText = "";
        headingHeight += parseInt(window.getComputedStyle(heading).getPropertyValue("margin-top"), 10);
        headingHeight += parseInt(window.getComputedStyle(heading).getPropertyValue("margin-bottom"), 10);
        this.actionHeadingHeight = headingHeight + "px";
    },

    beforeDestroy() {
        this.$eventBus.$off("room-view-cancel", this.endAction);
    }
};
</script>

<style scoped>
/* Good info on how Flexbox centering makes overflowing items inaccessible via scrolling: */
/* https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container */

/* Page layout */

.room-view {
    padding: 2rem;

    display: flex;
    flex-direction: column;
    overflow: auto;
}

.room-view-padding-override {
    padding: v-bind(actionHeadingHeight) 2rem 2rem;
}

.room-grid-container {
    display: flex;
    margin: auto;
}


/* Grid styling */

.room-grid {
    border: v-bind(roomGridBorder);
    max-width: 80rem;
    max-height: 50rem;
    min-height: 0;

    display: grid;
    grid-template-columns: v-bind(cssGridColumns);
    grid-template-rows: v-bind(cssGridRows);

    column-gap: 1rem;
    row-gap: 1rem;
}

.room {
    background-color: var(--blue-room-background);
    border: 1px solid var(--blue-room-border);

    position: relative;
}

.room > .room-title {
    position: absolute;
    bottom: 0;
    left: 50%;
    /* https://www.w3.org/Style/Examples/007/center.en.html#hv3 */
    margin-right: -50%;
    transform: translate(-50%, 0);

    margin-bottom: 0.1rem;
    color: var(--blue-room-text);
    font-size: 1.5rem;
}


/* Grid buttons */

.add-room-grid-button {
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

.buttons-spacer {
    flex-grow: 1;
    flex-shrink: 0.5;
    height: 1.5rem;
    max-height: 3rem;
}

button.btn {
    padding: 0.6rem 1rem;
}

.room-button-group {
    z-index: 1;
    position: sticky;
    bottom: 1rem;
    max-width: max-content;
    margin: auto;
}

.add-room-button {
    margin-right: 0.4rem;

    --bs-btn-bg: var(--blue-rooms-main);
    --bs-btn-hover-bg: var(--blue-rooms-main-darker1);
    --bs-btn-active-bg: var(--blue-rooms-main-darker2);
}

button.cancel-button {
    width: 9rem;

    z-index: 1;
    position: sticky;
    bottom: 1rem;
}


/* Action heading */
.action-heading {
    margin: 0 auto 2rem;
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
    left: 0;
}
</style>
