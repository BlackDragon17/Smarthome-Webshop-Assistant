<template>
    <section class="room-view">
        <div class="room-grid">
            <div class="room">
                Sample Room
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomeRoomView",

    computed: {
        roomGridBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkgreen";
        }
    }
};
</script>

<style>
.room-grid {
    display: flex;
    flex-direction: row;

    border: v-bind(roomGridBorder);
}

.room {
    background-color: #E3F2FD;
    border: 1px solid #90CAF9;

    color: #1565C0;
    font-size: 1.6rem;
    text-align: center;

    flex-grow: 1;
    max-width: 6rem;
}
</style>
