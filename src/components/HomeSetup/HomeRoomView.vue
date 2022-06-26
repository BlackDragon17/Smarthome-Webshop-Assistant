<template>
    <section class="room-view">
        <div class="room-grid">
            <div class="room" v-for="room in currentSetup.rooms">
                <p class="room-title">{{ room.name }}</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomeRoomView",

    props: ["currentSetup"],

    computed: {
        gridWidth() {
            let lowestX = 0;
            let highestX = 0;
            for (const room of this.currentSetup.rooms) {
                if (room.location.x > highestX) {
                    highestX = room.location.x;
                }
                if (room.location.x < lowestX) {
                    lowestX = room.location.x;
                }
            }
            return Math.abs(lowestX) + Math.abs(highestX) + 1;
        },

        gridHeight() {
            let lowestY = 0;
            let highestY = 0;
            for (const room of this.currentSetup.rooms) {
                if (room.location.y > highestY) {
                    highestY = room.location.y;
                }
                if (room.location.y < lowestY) {
                    lowestY = room.location.y;
                }
            }
            return Math.abs(lowestY) + Math.abs(highestY) + 1;
        },

        roomGridBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkgreen";
        }
    },

    mounted() {
        console.log("grid dim:", this.gridWidth, this.gridHeight);
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
