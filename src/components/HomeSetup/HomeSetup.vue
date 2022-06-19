<template>
    <div class="main">
        <HomeSidebar :all-products="allProducts"
                     :example-setup="exampleSetup"
                     :sort-by-room="sortByRoom"
                     :products-by-type="productsByType"
                     :products-by-room="productsByRoom"/>

        <HomeRoomView/>
    </div>
</template>

<script>
import { capitalize } from "vue";

export default {
    name: "HomeSetup",

    data() {
        return {
            sortByRoom: false
        };
    },

    props: ["allProducts", "exampleSetup"],

    computed: {
        productsByType() {
            const byType = {};
            for (const product of this.exampleSetup.products) {
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
            for (const i in this.exampleSetup.products) {
                const room = this.exampleSetup.products[i].room;
                if (byRoom[room]) {
                    byRoom[room].push(this.allProducts.data[this.exampleSetup.products[i].guid]);
                } else {
                    byRoom[room] = [this.allProducts.data[this.exampleSetup.products[i].guid]];
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

/* Temp stuff */
:deep(.box) {
    height: 100px;
    margin: 10px;
    background-color: lightgray;
    border: 1px solid darkgray;
}
</style>
