<template>
    <aside class="sidebar">
        <AddDeviceModal/>
        <button class="add-device-button btn btn-success">Add new device</button>

        <div class="dropdown">
            <button class="btn btn-primary" data-bs-toggle="dropdown" data-bs-auto-close="outside" style="margin-left: 9rem">Test</button>

            <div id="my-pop" class="my-pop dropdown-menu" style="box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);">
                <p style="font-weight: bold">Heading</p>
                <p>Body</p>
            </div>
        </div>

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
            <div class="devices-group" v-for="type in Object.keys(productsByType).sort()">
                <p>{{ type }}</p>
                <button class="device-card" v-for="product in productsByType[type]">
                    {{ product.brand }} {{ product.model }}
                </button>
            </div>
        </div>

        <div class="products-list" v-else>
            <div class="devices-group" v-for="room in Object.keys(productsByRoom).sort()">
                <p>{{ room }}</p>
                <button class="device-card" v-for="product in productsByRoom[room]">
                    {{ product.brand }} {{ product.model }}
                </button>
            </div>
        </div>
    </aside>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";
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
    },

    beforeUnmount() {
        this.$eventBus.$off("print-debug", this.test);
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
    padding-left: 0.5rem;
    width: calc(100% + 0.8rem);

    border: v-bind(productsListBorder);
    overflow-y: auto;
}

.devices-group {
    margin-bottom: 1.5rem;
    padding: 0 0.6rem 0 0.1rem;
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
    border-radius: 0.5rem;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    background-color: white;
}

.device-card:hover, .device-card:focus {
    background-color: #EEE;
}

.device-card:active {
    background-color: #DDD;
}

.my-pop {
    transform: none !important;
}
</style>
