<template>
    <aside class="sidebar">
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
    </aside>
</template>

<script>
export default {
    name: "HomeSidebar",

    props: ["allProducts", "exampleSetup", "sortByRoom", "productsByType", "productsByRoom"],

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

<style>
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
