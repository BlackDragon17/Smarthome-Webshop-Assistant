<template>
    <div class="main" tabindex="-1" @keydown.esc="cancelAction">
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
            currentAction: null,

            sortByRoom: false
        };
    },

    props: ["allProducts", "currentSetup"],

    // Since HomeSetup is responsible for cancelling in-progress actions, it emits all local events
    emits: ["add-room-toggle", "delete-room-toggle"],

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
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        focusThis() {
            this.$el.focus();
        },

        // Cancels an in-progress action.
        cancelAction() {
            // Since all actions=events are toggles, one can just emit it to cancel it.
            if(this.currentAction) {
                this.$eventBus.$emit(this.currentAction);
            }
        },


        /**
         * Sets or removes the given action as the currentAction.
         * If another action is in progress, it will be cancelled first.
         * @param action The action to start or stop.
         */
        actionToggler(action) {
            if (!this.currentAction) {
                this.currentAction = action;
            } else if (this.currentAction === action) {
                this.currentAction = null
            } else {
                this.$eventBus.$emit(this.currentAction);
                this.currentAction = action;
            }
        }
    },

    mounted() {
        this.$eventBus.$on("focus-home-setup", this.focusThis);
        this.$eventBus.$on("add-room-toggle", this.actionToggler.bind(this, "add-room-toggle"));
        this.$eventBus.$on("add-device-toggle", this.actionToggler.bind(this, "add-device-toggle"));
    },

    beforeDestroy() {
        this.$eventBus.$off("focus-home-setup", this.focusThis);
        this.$eventBus.$off("add-room-toggle", this.actionToggler.bind(this, "add-room-toggle"));
        this.$eventBus.$off("add-device-toggle", this.actionToggler.bind(this, "add-device-toggle"));
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

:deep(.btn) {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
}
</style>
