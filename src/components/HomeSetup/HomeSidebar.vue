<template>
    <aside class="sidebar">
        <AddDeviceModal/>
        <button class="add-device-button btn btn-success" @click="addNewDevice">Add new device</button>

        <button v-if="false" @click="printDebugInfo">Print debug info</button>


        <div class="sort-button-group">
            <button @click="sortByRoom = !sortByRoom">Switch sort</button>
        </div>

        <div class="sort-button-group btn-group"
             role="group"
             aria-label="Radio toggle button group for switching product sort order"
             v-if="false">
            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" for="btnradio1">Radio 1</label>

            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
            <label class="btn btn-outline-primary" for="btnradio2">Radio 2</label>
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
import AddDeviceModal from "./AddDeviceModal.vue";

export default {
    name: "HomeSidebar",

    components: {
        AddDeviceModal
    },

    data() {
        return {};
    },

    props: ["allProducts", "currentSetup", "sortByRoom", "productsByType", "productsByRoom"],

    emits: ["add-room-toggle", "delete-room-toggle", "add-device-toggle"],

    computed: {
        productsListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        printDebugInfo() {
            const first = this.allProducts.data;
            console.log("read:", first);
            console.log("keys:", Object.keys(this.allProducts.data));
            console.log("byType:", this.productsByType);
            console.log("byTypeKeys:", Object.keys(this.productsByType));
            console.log("byRoomKeys:", Object.keys(this.productsByRoom));
            console.log("sortByRoom:", this.sortByRoom);
        },

        addNewDevice() {
            this.$eventBus.$emit("add-device-toggle");
            new Modal("#addDeviceModal").show();
            this.$eventBus.$emit("add-device-toggle");
        }
    }
};
</script>

<style scoped>
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

.sidebar > .products-list {
    border: v-bind(productsListBorder);
    overflow: auto;
}

.add-device-button {
    --bs-btn-bg: var(--green-devices-main);
    --bs-btn-hover-bg: var(--green-devices-main-darker1);
    --bs-btn-active-bg: var(--green-devices-main-darker2);
    /* --bs-btn-active-border-color: red; */
}
</style>
