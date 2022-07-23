<template>
    <div class="main" tabindex="-1" @keydown.esc="emitEscAction">
        <DeviceInfoModal ref="deviceInfoModal" :setup-devices="currentSetup.devices"/>

        <HomeSidebar :sort-by-room="sortByRoom"
                     :current-setup="currentSetup"
                     :devices-by-type="devicesByType"
                     :devices-by-room="devicesByRoom"/>

        <HomeRoomView :current-setup="currentSetup"/>
    </div>
</template>

<script>
import DeviceInfoModal from "./modals/DeviceInfoModal.vue";
import HomeSidebar from "./HomeSidebar.vue";
import HomeRoomView from "./HomeRoomView.vue";

export default {
    name: "HomeSetup",

    components: {
        DeviceInfoModal,
        HomeSidebar,
        HomeRoomView
    },

    data() {
        return {
            roomViewBusy: false,
            popoverShown: false,

            sortByRoom: false
        };
    },

    props: {
        currentSetup: Object,
        devicesByType: Object,
        devicesByRoom: Object
    },

    emits: ["print-debug", "room-view-cancel", "popover-hide"],

    computed: {
        homeSetupBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        focusThis() {
            this.$el.focus();
        },
        setRoomViewBusy(value) {
            this.roomViewBusy = value;
        },
        setPopoverShown(value) {
            this.popoverShown = value;
        },

        openDeviceInfo(device) {
            this.$refs.deviceInfoModal.openModal(device);
        },

        emitEscAction() {
            console.log("gi");
            if (this.popoverShown) {
                this.$eventBus.$emit("popover-hide");
            } else if (this.roomViewBusy) {
                this.$eventBus.$emit("room-view-cancel");
            }
        },
        emitPrintDebug(event) {
            if (event.keyCode === 68) {
                this.$eventBus.$emit("print-debug");
            }
        }
    },

    mounted() {
        this.$root.activeRootView = this.$el;

        this.$eventBus.$on("focus-home-setup", this.focusThis);
        this.$eventBus.$on("open-device-info", device => this.openDeviceInfo(device));
        this.$eventBus.$on("room-view-busy", this.setRoomViewBusy.bind(this, true));
        this.$eventBus.$on("room-view-free", this.setRoomViewBusy.bind(this, false));
        this.$eventBus.$on("popover-shown", this.setPopoverShown.bind(this, true));
        this.$eventBus.$on("popover-hidden", this.setPopoverShown.bind(this, false));

        window.addEventListener("keydown", this.emitPrintDebug);
    },

    beforeUnmount() {
        this.$eventBus.$off("focus-home-setup", this.focusThis);
        this.$eventBus.$off("open-device-info", device => this.openDeviceInfo(device));
        this.$eventBus.$off("room-view-busy", this.setRoomViewBusy.bind(this, true));
        this.$eventBus.$off("room-view-free", this.setRoomViewBusy.bind(this, false));
        this.$eventBus.$off("popover-shown", this.setPopoverShown.bind(this, true));
        this.$eventBus.$off("popover-hidden", this.setPopoverShown.bind(this, false));

        window.removeEventListener("keydown", this.emitPrintDebug);
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
