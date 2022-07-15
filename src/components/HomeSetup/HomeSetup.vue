<template>
    <div class="main" tabindex="-1" @keydown.esc="cancelAction">
        <HomeSidebar :all-products="allProducts"
                     :current-setup="currentSetup"
                     :sort-by-room="sortByRoom"
                     :products-by-type="productsByType"
                     :products-by-room="productsByRoom"/>

        <HomeRoomView :current-setup="currentSetup"
                      :products-by-room="productsByRoom"/>
    </div>
</template>

<script>
import { capitalize } from "vue";

import HomeSidebar from "./HomeSidebar.vue";
import HomeRoomView from "./HomeRoomView.vue";

export default {
    name: "HomeSetup",

    components: {
        HomeSidebar,
        HomeRoomView
    },

    data() {
        return {
            roomViewBusy: false,
            sortByRoom: false
        };
    },

    props: {
        allProducts: Object,
        currentSetup: Object
    },

    computed: {
        productsByType() {
            const byType = {};
            for (const product of this.currentSetup.products) {
                const type = capitalize(this.allProducts.data[product.productId].type) + "s";
                if (byType[type]) {
                    byType[type].push(this.allProducts.data[product.productId]);
                } else {
                    byType[type] = [this.allProducts.data[product.productId]];
                }
            }
            return byType;
        },
        productsByRoom() {
            const byRoom = {};
            for (const i in this.currentSetup.products) {
                const room = this.currentSetup.products[i].room;
                if (byRoom[room]) {
                    byRoom[room].push(this.allProducts.data[this.currentSetup.products[i].productId]);
                } else {
                    byRoom[room] = [this.allProducts.data[this.currentSetup.products[i].productId]];
                }
            }
            return byRoom;
        },

        homeSetupBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        focusThis() {
            this.$el.focus();
        },

        cancelAction() {
            if (this.roomViewBusy) {
                this.$eventBus.$emit("room-view-cancel");
            }
        },

        printDebug(event) {
            if (event.keyCode === 68) {
                this.$eventBus.$emit("print-debug");
            }
        },

        setRoomViewBusy(value) {
            this.roomViewBusy = value;
        }
    },

    mounted() {
        this.$eventBus.$on("focus-home-setup", this.focusThis);
        this.$eventBus.$on("room-view-busy", this.setRoomViewBusy.bind(this, true));
        this.$eventBus.$on("room-view-free", this.setRoomViewBusy.bind(this, false));

        window.addEventListener("keydown", this.printDebug);
    },

    beforeUnmount() {
        this.$eventBus.$off("focus-home-setup", this.focusThis);
        this.$eventBus.$off("room-view-busy", this.setRoomViewBusy.bind(this, true));
        this.$eventBus.$off("room-view-free", this.setRoomViewBusy.bind(this, false));

        window.removeEventListener("keydown", this.printDebug);
    }
};
</script>

<style scoped>
.main {
    height: 100%;

    display: flex;
    flex-direction: row;
}

.main > * {
    border: v-bind(homeSetupBorder);
}

.sidebar {
    flex-shrink: 0;
    z-index: 1;
}

.room-view {
    flex-grow: 1;
}
</style>
