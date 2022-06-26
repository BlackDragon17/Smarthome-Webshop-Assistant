<template>
    <section class="room-view">
        <div class="room-grid">
            <div class="room" v-for="room in currentSetup.rooms" :key="room.name" :style="positionRoom(room)">
                <p class="room-title">{{ room.name }}</p>
            </div>
        </div>
        <button @click="printDebug">Debug</button>
    </section>
</template>

<script>
export default {
    name: "HomeRoomView",

    data() {
        return {
            gridStartCoord: 1,
            currentSetupLocal: this.currentSetup
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

        roomGridBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkgreen";
        }
    },

    methods: {
        positionRoom(room) {
            return `grid-column: ${room.location.x} / span 1; grid-row: ${room.location.y} / span 1;`;
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

        printDebug() {
            console.log("grid dim:", this.gridWidth, this.gridHeight);
            console.log("lowest coords:", this.lowestCoords);
            console.log("highest coords:", this.highestCoords);
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
    grid-template-columns: repeat(v-bind(gridWidth), minmax(10rem, 40rem));
    grid-template-rows: repeat(v-bind(gridHeight), minmax(5rem, 20rem));

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
</style>
