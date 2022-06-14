<template>
    <header>
        <nav class="header">
            <a href="#" class="logo">SH<span>WA</span></a>
            <ul class="header-nav">
                <li><a href="#">Home Setup</a></li>
                <li><a href="#">Product Database</a></li>
            </ul>
        </nav>
    </header>

    <main id="app" class="app">
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
    </main>
</template>

<script>
import allProducts from "../resources/products/packed/PackedJSONs.json";


const exampleGuid = "93d3b750-8a1a-4b85-8d32-11f35b03815a"

export default {
    data() {
        return {
            // allProducts: {},
            // allProductsLoaded: false,

            sortByRoom: false,

            // Example Home Setup (these could later be written to ´localStorage´)
            exampleSetup: {
                rooms: ["Living Room", "Kitchen", "Bedroom", "Bathroom"],
                products: [
                    {
                        guid: "d0650af1-1786-4c93-8078-32ee23d1683b",
                        room: "Living Room"
                    },
                    {
                        guid: "c4d7a53b-e7cc-4d0e-852a-c99e03025941",
                        room: "Living Room"
                    },
                    {
                        guid: "1721ac8c-747c-4201-bf89-3752c5506168",
                        room: "Bedroom"
                    },
                    {
                        guid: "93d3b750-8a1a-4b85-8d32-11f35b03815a",
                        room: "Kitchen"
                    },
                    {
                        guid: "e07e5331-e468-4ef9-bf58-17fd315f1c99",
                        room: "Bedroom"
                    }
                ]
            }
        };
    },

    computed: {
        productsByType() {
            const byType = {};
            for (const product of this.exampleSetup.products) {
                const type = this.capitalize(allProducts.data[product.guid].type) + "s";
                if (byType[type]) {
                    byType[type].push(allProducts.data[product.guid]);
                } else {
                    byType[type] = [allProducts.data[product.guid]];
                }
            }
            return byType;
        },
        productsByRoom() {
            const byRoom = {};
            for (const i in this.exampleSetup.products) {
                const room = this.exampleSetup.products[i].room;
                if (byRoom[room]) {
                    byRoom[room].push(allProducts.data[this.exampleSetup.products[i].guid]);
                } else {
                    byRoom[room] = [allProducts.data[this.exampleSetup.products[i].guid]];
                }
            }
            return byRoom;
        }
    },

    methods: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        test() {
            const first = allProducts.data;
            console.log("read:", first);
            console.log("keys:", Object.keys(allProducts.data));
            console.log("type:", allProducts.data[exampleGuid].type);
            console.log("byType:", this.productsByType);
            console.log("byTypeKeys:", Object.keys(this.productsByType));
            console.log("byRoomKeys:", Object.keys(this.productsByRoom))
            console.log("sortByRoom:", this.sortByRoom);
            return first;
        }

        // async fetchAllProducts() {
        //     const products = await fetch(allProductsJson).then(res => res.json());
        //     for (const product of products.data) {
        //         allProducts[product.guid] = product;
        //     }
        //     console.log("fetched");
        // },
    },

    // created() {
    //     this.fetchAllProducts().then(() => this.allProductsLoaded = true, function (err) {
    //         alert("Loading failed! Trying again...\nError: " + err);
    //         location.reload();
    //     });
    // }
};
</script>

<style>
@import "./assets/styles.css";
</style>
