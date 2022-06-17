<template>
    <section class="sidebar">
        <button style="margin: 0 1rem" @click="test">Test</button>
        <button class="add-device" @click="">Add new device</button>
        <br>

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
    </section>

    <section class="room-view">

    </section>
</template>

<script>
import { capitalize } from "vue";

export default {
    name: "HomeSetup",

    data() {
        return {
            sortByRoom: false,
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
        }
    },

    methods: {
        test() {
            const first = this.allProducts.data;
            console.log("read:", first);
            console.log("keys:", Object.keys(this.allProducts.data));
            console.log("byType:", this.productsByType);
            console.log("byTypeKeys:", Object.keys(this.productsByType));
            console.log("byRoomKeys:", Object.keys(this.productsByRoom))
            console.log("sortByRoom:", this.sortByRoom);
        },
    }
}
</script>

<style scoped>
/* Main Content */
main.app {

}


/* Sidebar */

.sidebar {
    background-color: #F8F8F8;
    width: 340px;
    height: 100%;
    padding: 0.5rem;
}

.sidebar > .add-device {
    margin: 1rem 0;
}

.sidebar > .products-list {
    margin: 1rem 0;
    border: 1px solid darkgoldenrod;
}


/* Temp stuff */
.box {
    height: 100px;
    margin: 10px;
    background-color: lightgray;
    border: 1px solid darkgray;
}
</style>
