<template>
    <NavHeader ref="header" @header-click="headerAction"/>

    <main ref="app">
        <HomeSetup :all-products="allProducts" :example-setup="exampleSetup"/>
    </main>
</template>

<script>
import allProducts from "../resources/products/packed/PackedJSONs.json";

export default {
    data() {
        return {
            allProducts,

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
                ],
                rooms2: [
                    {
                        name: "Living Room",
                        location: {
                            x: 0,
                            y: 0
                        }
                    },
                    {
                        name: "Kitchen",
                        location: {
                            x: -1,
                            y: 0
                        }
                    },
                    {
                        name: "Bedroom",
                        location: {
                            x: 1,
                            y: 0
                        }
                    },
                    {
                        name: "Bathroom",
                        location: {
                            x: 1,
                            y: 1
                        }
                    }
                ],
            }
        };
    },

    methods: {
        headerAction(target) {
            //TODO: Switch page
            console.log("Header target:", target);
        }
    },

    mounted() {
        // Set the height of the Main content to 100vh - headerHeight
        let headerHeight = this.$refs.header.$el.offsetHeight;
        this.$refs.app.style.height = `calc(100vh - ${headerHeight}px)`;
    }
};
</script>

<style>
/* Override and set default styles */

*, ::after, ::before {
    box-sizing: border-box;
}

body {
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Ubuntu, "Open Sans", sans-serif;
    line-height: 1.4;
}

ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
}

p {
    margin: 0;
}

.inline-icon {
    vertical-align: bottom;
    font-size: 1.4em;
}
</style>
