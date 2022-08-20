<template>
    <aside class="sidebar">
        <button class="add-device-button btn btn-success">Add new device</button>

        <div class="sort-group">
            <span class="sort-label">Sort devices by</span>
            <div class="sort-button-group btn-group" role="group" aria-label="Toggle for switching product sort order">
                <input type="radio"
                       class="btn-check"
                       id="sort-radio-1"
                       name="sort-radio"
                       :value="false"
                       v-model="sortByRoom"
                       autocomplete="off"
                       checked>
                <label class="sort-button radio-btn btn btn-outline-secondary" for="sort-radio-1">Type</label>

                <input type="radio"
                       class="btn-check"
                       id="sort-radio-2"
                       name="sort-radio"
                       :value="true"
                       v-model="sortByRoom"
                       autocomplete="off">
                <label class="sort-button radio-btn btn btn-outline-secondary" for="sort-radio-2">Room</label>
            </div>
        </div>

        <hr>

        <div class="products-list" v-if="!sortByRoom">
            <div class="devices-group" v-for="category in Object.keys(devicesByCategory).sort()">
                <p>{{ category }}</p>
                <button class="device-card" v-for="device in devicesByCategory[category]" @click="$eventBus.$emit('open-device-info', device)">
                    <span class="inline-icon material-symbols-rounded">
                        {{ $getName.categoryIcon(allProducts[device.productId].category) }}
                    </span>
                    {{ allProducts[device.productId].brand }} {{ allProducts[device.productId].model }}
                </button>
            </div>
        </div>

        <div class="products-list" v-else>
            <div class="devices-group" v-for="room in Object.keys(devicesByRoom).sort()">
                <p>{{ room }}</p>
                <button class="device-card" v-for="device in devicesByRoom[room]" @click="$eventBus.$emit('open-device-info', device)">
                    <span class="inline-icon material-symbols-rounded">
                        {{ $getName.categoryIcon(allProducts[device.productId].category) }}
                    </span>
                    {{ allProducts[device.productId].brand }} {{ allProducts[device.productId].model }}
                </button>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: "HomeSidebar",

    data() {
        return {
            sortByRoom: false
        };
    },

    props: {
        currentSetup: Object,
        devicesByCategory: Object,
        devicesByRoom: Object
    },

    emits: ["open-device-info"],

    inject: ["allProducts"],

    computed: {
        productsListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    }
};
</script>

<style scoped>
/* Sidebar styles */

.sidebar {
    width: 340px;
    height: 100%;
    padding: 0.5rem;
    background-color: #F8F8F8;

    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
}

.sidebar > * {
    /* border: 1px solid darkcyan; */
    display: block;
    width: 100%;
    margin: 0.7rem 0;
}



/* Sidebar content styles */

.add-device-button {
    padding: 0.5rem;
    --bs-btn-bg: var(--green-devices-main);
    --bs-btn-hover-bg: var(--green-devices-main-darker1);
    --bs-btn-active-bg: var(--green-devices-main-darker2);
}

.sort-group {
    margin-bottom: 0;
    display: flex;
    align-items: center;
}

.sort-label {
    font-size: 1.05rem;
}

.sort-button-group {
    margin-left: auto;
    margin-right: 0.2rem;
}

.sort-button {
    --bs-btn-color: var(--bs-gray);
    --bs-btn-hover-color: var(--bs-gray);
    --bs-btn-hover-bg: var(--gray-button-hover);
}



/* Products list */

.products-list {
    /* Override horizontal sidebar padding to fix device shadow clipping */
    margin: 0 -0.3rem 0.7rem -0.5rem;
    padding: 0 0.6rem;
    width: calc(100% + 0.8rem);

    border: v-bind(productsListBorder);
    overflow-y: auto;
}

.devices-group {
    margin-bottom: 1.5rem;
}

.devices-group > :first-child {
    font-size: 1.05rem;
    font-weight: 500;
}

.device-card {
    display: block;
    margin: 0.6rem 0;
    padding: 0.5rem;
    width: 100%;
    min-height: 5.5rem;

    border: 1px solid lightgray;
    border-radius: var(--button-border-radius);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    background-color: white;
}

.device-card:hover, .device-card:focus {
    background-color: #EEE;
}

.device-card:active {
    background-color: #DDD;
}
</style>
