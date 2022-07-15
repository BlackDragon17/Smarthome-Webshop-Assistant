<template>
    <aside class="sidebar">
        <AddDeviceModal/>
        <button class="add-device-button btn btn-success">Add new device</button>

        <button v-if="false" @click="printDebugInfo">Print debug info</button>

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


        <div class="products-list" v-if="!sortByRoom">
            <div v-for="type in Object.keys(productsByType).sort()">
                {{ type }}
                <div class="box" v-for="product in productsByType[type]">
                    {{ product.brand }} {{ product.model }}
                </div>
            </div>
        </div>

        <div class="products-list" v-else>
            <div v-for="room in Object.keys(productsByRoom).sort()">
                {{ room }}
                <div class="box" v-for="product in productsByRoom[room]">
                    {{ product.brand }} {{ product.model }}
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import { Modal } from "bootstrap";
import AddDeviceModal from "./modals/AddDeviceModal.vue";

export default {
    name: "HomeSidebar",

    components: {
        AddDeviceModal
    },

    props: {
        allProducts: Object,
        currentSetup: Object,
        sortByRoom: Boolean,
        productsByType: Object,
        productsByRoom: Object
    },

    emits: ["add-room-toggle", "delete-room-toggle", "add-device-toggle"],

    computed: {
        productsListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        addNewDevice() {
            this.$eventBus.$emit("add-device-toggle");
            new Modal("#addDeviceModal").show();
            this.$eventBus.$emit("add-device-toggle");
        },

        test() {

        },
        printDebugInfo() {
            const first = this.allProducts.data;
            console.log("read:", first);
            console.log("keys:", Object.keys(this.allProducts.data));
            console.log("byType:", this.productsByType);
            console.log("byTypeKeys:", Object.keys(this.productsByType));
            console.log("byRoomKeys:", Object.keys(this.productsByRoom));
            console.log("sortByRoom:", this.sortByRoom);
        }
    },

    mounted() {
        this.$eventBus.$on("print-debug", this.test);
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

    display: flex;
    flex-direction: column;
}

.sidebar > * {
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
    padding: 0 0.2rem;
    display: flex;
    align-items: center;
}

.sort-label {
    font-size: 1.05rem;
}

.sort-button-group {
    margin-left: auto;
    margin-right: 0.5rem;
}

.sort-button {
    --bs-btn-color: var(--bs-gray);
    --bs-btn-hover-color: var(--bs-gray);
    --bs-btn-hover-bg: var(--gray-button-hover);
}

.sidebar > .products-list {
    border: v-bind(productsListBorder);
    overflow: auto;
}
</style>
