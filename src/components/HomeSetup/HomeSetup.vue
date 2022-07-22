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
        currentSetup: Object,
        productsByType: Object,
        productsByRoom: Object
    },

    computed: {
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
        this.$root.activeRootView = this.$el;

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
