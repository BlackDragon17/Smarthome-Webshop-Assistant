<template>
    <section class="room-view">
        <AddRoomModal ref="addRoomModal" :setup-rooms="currentSetup.rooms" @room-added="removeAddRoomButtons"/>
        <div class="room-grid">
            <div class="room" v-for="room in currentSetup.rooms" :key="room.name" :style="positionRoom(room)">
                <p class="room-title">{{ room.name }}</p>
            </div>
            <button class="add-room-grid-button"
                    v-for="button in addRoomButtons"
                    :key="'' + button.location.x + button.location.y"
                    :style="positionButton(button)"
                    @click="addRoom(button)">
                Click to add a<br>New Room<br>here
            </button>
        </div>
        <button v-if="false" @click="printDebug">Debug</button>
    </section>
</template>

<script>
export default {
    name: "HomeRoomView",

    data() {
        return {
            gridStartCoord: 1,
            addRoomButtons: [],

            addButtonsShown: false
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
            return this.gridStartCoord === 1 ? `repeat(${this.gridHeight}, minmax(5rem, 20rem))`
                : `repeat(${this.gridHeight + 2}, minmax(5rem, 20rem))`;
        },

        roomGridBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkgreen";
        }
    },

    methods: {
        positionRoom(room) {
            return `grid-column: ${room.location.x} / span 1; grid-row: ${room.location.y} / span 1;`;
        },

        positionButton(button) {
            return `grid-column: ${button.location.x} / span 1; grid-row: ${button.location.y} / span 1;`;
        },


        // Offset rooms' location to meet the grid's starting coordinate
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
            this.addButtonsShown = true;

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
            this.addButtonsShown = false;

            this.addRoomButtons = [];
            this.gridStartCoord = 1;
            this.shiftRoomCoords();
        },


        addRoom(button) {
            this.$refs.addRoomModal.openModal(button);
        },


        printDebug() {
            console.log("grid dim:", this.gridWidth, this.gridHeight);
            console.log("lowest coords:", this.lowestCoords);
            console.log("highest coords:", this.highestCoords);
            console.log("grid start:", this.gridStartCoord);
            console.log("css col:", this.cssGridColumns);
        },

        toggleAddRoomButtons() {
            if (this.addButtonsShown) {
                this.removeAddRoomButtons();
            } else {
                this.createAddRoomButtons();
            }
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
        this.$bus.$on("add-new-room", this.toggleAddRoomButtons);
    },

    beforeDestroy() {
        this.$bus.$off("add-new-room", this.toggleAddRoomButtons)
    }
};
</script>

<style>
.room-view {
    padding: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

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
    background-color: #E3F2FD;
    border: 1px solid #90CAF9;

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
    color: #1565C0;
    font-size: 1.5rem;
}

.add-room-grid-button {
    background-color: #f8faff;
    border: 1px solid #cde6ff;
}

.add-room-grid-button:hover, .add-room-grid-button:focus {
    background-color: #deeeff;
    border: 1px solid #8dccff;
}

.add-room-grid-button:active {
    background-color: #96c8ef;
    border: 1px solid #4eaeef;
}
</style>
