<template>
    <div class="main">
        <HomeSidebar :all-products="allProducts"
                     :current-setup="currentSetup"
                     :sort-by-room="sortByRoom"
                     :products-by-type="productsByType"
                     :products-by-room="productsByRoom"/>

        <HomeRoomView :current-setup="currentSetup"/>
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
            sortByRoom: false
        };
    },

    props: ["allProducts", "currentSetup"],

    computed: {
        productsByType() {
            const byType = {};
            for (const product of this.currentSetup.products) {
                const type = capitalize(this.allProducts.data[product.guid].type) + "s";
                if (byType[type]) {
                    byType[type].push(this.allProducts.data[product.guid]);
                } else {
                    byType[type] = [this.allProducts.data[product.guid]];
                }
            }
            return byType;
        },
        productsByRoom() {
            const byRoom = {};
            for (const i in this.currentSetup.products) {
                const room = this.currentSetup.products[i].room;
                if (byRoom[room]) {
                    byRoom[room].push(this.allProducts.data[this.currentSetup.products[i].guid]);
                } else {
                    byRoom[room] = [this.allProducts.data[this.currentSetup.products[i].guid]];
                }
            }
            return byRoom;
        },

        homeSetupBorder() {
            return import.meta.env.PROD ? "none" : "1px solid darkred";
        }
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
}

.room-view {
    flex-grow: 1;
}
</style>
