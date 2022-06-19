<template>
    <section class="room-view">
        <div class="room-grid">
            <div class="room" v-for="room in exampleSetup.rooms">
                <p class="room-title">{{ room }}</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomeRoomView",

    props: ["exampleSetup"],

    computed: {
        roomGridBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkgreen";
        }
    }
};
</script>

<style>
.room-view {
    padding: 2rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.room-grid {
    border: v-bind(roomGridBorder);
    /* margin: 1.5rem auto; */
    flex-grow: 1;
    max-width: 100rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.room {
    background-color: #E3F2FD;
    border: 1px solid #90CAF9;

    flex-grow: 1;
    width: 20rem;
    max-width: 30rem;
    height: 10rem;

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
