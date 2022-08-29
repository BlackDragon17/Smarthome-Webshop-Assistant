<template>
    <div class="main" tabindex="-1" @keydown.esc="emitEscAction">
        <ConfirmCancelActionModal ref="confirmCancelActionModal"
                                  :current-view="$options.name"
                                  :view-state="viewState"
                                  @cancel-action="confirmCancel"/>

        <DeviceInfoModal ref="deviceInfoModal"
                         :current-devices="currentSetup.devices"
                         :device-queue="deviceQueue"
                         @device-removed="emitEscRoomViewAction"/>

        <HomeSidebar :current-setup="currentSetup"
                     :devices-by-category="devicesByCategory"
                     :devices-by-room="devicesByRoom"/>

        <HomeRoomView :current-setup="currentSetup"
                      :view-state="viewState"
                      :device-queue="deviceQueue"
                      @change-state="changeState"/>
    </div>
</template>

<script>
import ConfirmCancelActionModal from "@/components/ConfirmCancelActionModal.vue";
import DeviceInfoModal from "./modals/DeviceInfoModal.vue";
import HomeSidebar from "./HomeSidebar.vue";
import HomeRoomView from "./HomeRoomView.vue";

export default {
    name: "HomeSetup",

    components: {
        ConfirmCancelActionModal,
        DeviceInfoModal,
        HomeSidebar,
        HomeRoomView
    },

    data() {
        return {
            viewState: "init",
            popoverShown: false
        };
    },

    props: {
        currentSetup: Object,
        devicesByCategory: Object,
        devicesByRoom: Object,
        deviceQueue: Array
    },

    emits: ["change-view", "print-debug", "room-view-cancel", "popover-hide"],

    computed: {
        homeSetupBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkred";
        }
    },

    methods: {
        focusThis() {
            this.$el.focus();
        },
        setPopoverShown(value) {
            this.popoverShown = value;
        },
        changeState(value) {
            this.viewState = value;
            this.focusThis();
        },

        openDeviceInfo(device) {
            if (this.viewState === "normal") {
                this.$refs.deviceInfoModal.openModal(device);
            }
        },

        emitEscAction() {
            if (this.popoverShown) {
                this.$eventBus.$emit("popover-hide");
            } else if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$eventBus.$emit("room-view-cancel");
            }
        },
        emitEscRoomViewAction() {
            if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$eventBus.$emit("room-view-cancel");
            }
        },
        emitPrintDebug(event) {
            if (event.keyCode === 68) {
                this.$eventBus.$emit("print-debug");
            }
        },

        // ConfirmCancelActionModal callback
        confirmCancel(switchTarget) {
            this.emitEscRoomViewAction();
            this.$emit("change-view", switchTarget);
        },

        // Header action handling
        headerAction(target) {
            if (target === this.$options.name) {
                return;
            }

            if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$refs.confirmCancelActionModal.openModal(target);
            } else {
                this.$emit("change-view", target);
            }
        }
    },

    mounted() {
        this.$root.activeViewRoot = this.$el;

        this.$eventBus.$on("header-click", this.headerAction);
        this.$eventBus.$on("focus-home-setup", this.focusThis);
        this.$eventBus.$on("open-device-info", this.openDeviceInfo);
        this.$eventBus.$on("popover-shown", this.setPopoverShown);

        window.addEventListener("keydown", this.emitPrintDebug);
    },

    beforeUnmount() {
        this.$eventBus.$off("header-click", this.headerAction);
        this.$eventBus.$off("focus-home-setup", this.focusThis);
        this.$eventBus.$off("open-device-info", this.openDeviceInfo);
        this.$eventBus.$off("popover-shown", this.setPopoverShown);

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
}

.room-view {
    flex-grow: 1;
}
</style>
