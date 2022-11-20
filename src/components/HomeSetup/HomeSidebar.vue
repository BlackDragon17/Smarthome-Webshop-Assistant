<template>
    <ModifyControlsModal ref="modifyControlsModal" :setup-controls="currentSetup.controls"/>
    <aside class="sidebar">
        <button v-if="setupHasRooms" class="add-device-button btn btn-success" @click="addNewDevice">Add new device</button>
        <button class="modify-controls-button btn btn-secondary" @click="openControlsModal">Modify your controls</button>

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

        <div class="products-list">
            <div class="devices-group" v-for="category in Object.keys(sortedDevices).sort()">
                <p>{{ category }}</p>
                <DeviceCard v-for="device in sortedDevices[category]" :device="device" :product="allProducts[device.productId]"/>
            </div>
        </div>
    </aside>
</template>

<script>
import { mapState } from "pinia";
import { useProductsStore } from "@/stores/products-store";
import ModifyControlsModal from "./modals/ModifyControlsModal.vue";
import DeviceCard from "@/components/HomeSetup/DeviceCard.vue";
import Events from "@/assets/javascript/events";

export default {
    name: "HomeSidebar",

    components: {
        ModifyControlsModal,
        DeviceCard
    },

    data() {
        return {
            sortByRoom: false
        };
    },

    props: {
        currentSetup: Object,
        devicesByCategory: Object,
        devicesByRoom: Object,
        viewState: String,
        setupHasRooms: Boolean
    },

    emits: [Events.HEADER_CLICK],

    computed: {
        ...mapState(useProductsStore, ["allProducts"]),

        sortedDevices() {
            if (this.sortByRoom) {
                return this.devicesByRoom;
            } else {
                return this.devicesByCategory;
            }
        },

        productsListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        addNewDevice() {
            this.$eventBus.$emit(Events.HEADER_CLICK, "ProductDatabase");
        },

        openControlsModal() {
            if (this.viewState === "normal") {
                this.$refs.modifyControlsModal.openModal();
            }
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

    flex-shrink: 0.2;
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

.modify-controls-button {
    margin-top: 0.2rem;
    padding: 0.5rem;
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
    padding-top: 5px;
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
</style>
