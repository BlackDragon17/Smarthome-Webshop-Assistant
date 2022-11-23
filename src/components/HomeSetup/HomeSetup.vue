<template>
    <div class="main" tabindex="-1" @keydown.esc="emitEscAction">
        <ConfirmCancelActionModal ref="confirmCancelActionModal"
                                  :current-view="$options.name"
                                  :view-state="viewState"
                                  @cancel-action="confirmCancel"/>

        <DeviceInfoModal ref="deviceInfoModal"
                         :current-devices="currentSetup.devices"
                         :device-queue="deviceQueue"
                         :setup-has-rooms="setupHasRooms"
                         @device-removed="emitEscRoomViewAction"/>

        <HomeSidebar v-if="showSidebar"
                     :current-setup="currentSetup"
                     :devices-by-category="devicesByCategory"
                     :devices-by-room="devicesByRoom"
                     :view-state="viewState"
                     :setup-has-rooms="setupHasRooms"/>

        <HomeRoomView :current-setup="currentSetup"
                      :view-state="viewState"
                      :device-queue="deviceQueue"
                      @change-state="changeState"/>
    </div>
</template>

<script>
import Events from "@/assets/javascript/events";
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

    emits: [Events.CHANGE_VIEW, Events.PRINT_DEBUG, Events.ROOM_VIEW_CANCEL, Events.POPOVER_HIDE],

    computed: {
        showSidebar() {
            return this.currentSetup.rooms.length > 0 || this.currentSetup.devices.length > 0;
        },
        setupHasRooms() {
            return this.currentSetup.rooms.length > 0;
        },

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
                this.$eventBus.$emit(Events.POPOVER_HIDE);
            } else if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$eventBus.$emit(Events.ROOM_VIEW_CANCEL);
            }
        },
        emitEscRoomViewAction() {
            if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$eventBus.$emit(Events.ROOM_VIEW_CANCEL);
            }
        },
        emitPrintDebug(event) {
            if (event.key.toLowerCase() === "d") {
                this.$eventBus.$emit(Events.PRINT_DEBUG);
            }
        },

        // ConfirmCancelActionModal callback
        confirmCancel(switchTarget) {
            this.emitEscRoomViewAction();
            this.$emit(Events.CHANGE_VIEW, switchTarget);
        },

        // Header action handling
        headerAction(target) {
            if (target === this.$options.name) {
                return;
            }

            if (this.viewState !== "normal" && this.viewState !== "init") {
                this.$refs.confirmCancelActionModal.openModal(target);
            } else {
                this.$emit(Events.CHANGE_VIEW, target);
            }
        }
    },

    mounted() {
        this.$root.activeViewRoot = this.$el;

        this.$eventBus.$on(Events.HEADER_CLICK, this.headerAction);
        this.$eventBus.$on(Events.FOCUS_HOME_SETUP, this.focusThis);
        this.$eventBus.$on(Events.OPEN_DEVICE_INFO, this.openDeviceInfo);
        this.$eventBus.$on(Events.POPOVER_SHOWN, this.setPopoverShown);

        window.addEventListener("keyup", this.emitPrintDebug);
    },

    beforeUnmount() {
        this.$eventBus.$off(Events.HEADER_CLICK, this.headerAction);
        this.$eventBus.$off(Events.FOCUS_HOME_SETUP, this.focusThis);
        this.$eventBus.$off(Events.OPEN_DEVICE_INFO, this.openDeviceInfo);
        this.$eventBus.$off(Events.POPOVER_SHOWN, this.setPopoverShown);

        window.removeEventListener("keyup", this.emitPrintDebug);
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
