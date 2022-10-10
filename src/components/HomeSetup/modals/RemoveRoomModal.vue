<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" id="remove-room-modal" tabindex="-1" aria-labelledby="remove-room-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="remove-room-modal-label">Confirm room removal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="roomDevices.length <= 0">
                            Are you sure you want to remove the "<strong>{{ removingRoom.name }}</strong>" from your home?
                        </div>
                        <div v-else>
                            The <strong>{{ removingRoom.name }}</strong> contains <strong>{{ roomDevices.length }}</strong> devices.
                            What would you like to do with them?
                            <div class="devices-button-group btn-group-vertical"
                                 role="group"
                                 aria-label="Toggle for keeping or deleting devices with removed room">
                                <input type="radio"
                                       class="btn-check"
                                       id="devices-radio-1"
                                       name="devices-radio"
                                       :value="false"
                                       v-model="keepRoomDevices"
                                       autocomplete="off"
                                       checked>
                                <label class="devices-button radio-btn btn btn-outline-primary" for="devices-radio-1">
                                    <span class="radio-label-header">Remove devices</span>
                                    <span class="radio-label-body">
                                        Remove the {{ removingRoom.name }} together with its devices from your home setup
                                    </span>
                                </label>

                                <input type="radio"
                                       class="btn-check"
                                       id="devices-radio-2"
                                       name="devices-radio"
                                       :value="true"
                                       v-model="keepRoomDevices"
                                       autocomplete="off">
                                <label class="devices-button radio-btn btn btn-outline-primary" for="devices-radio-2">
                                    <span class="radio-label-header">Keep devices</span>
                                    <span class="radio-label-body">
                                        Remove the {{ removingRoom.name }} but keep its devices and store them in the Devices Tray
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="removeRoom">Remove room</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";

export default {
    name: "RemoveRoomModal",

    data() {
        return {
            bsModal: null,

            removingRoom: {},
            roomDevices: [],
            keepRoomDevices: false
        };
    },

    props: {
        roomViewState: String,
        currentSetup: Object
    },

    emits: ["removed-room", "focus-home-setup"],

    methods: {
        openModal(removingRoom) {
            this.removingRoom = removingRoom;
            this.bsModal.show();
            this.roomDevices = this.currentSetup.devices.filter(device => device.room === this.removingRoom.name);
        },

        resetModal() {
            this.removingRoom = {};
            this.roomDevices = [];
            this.keepRoomDevices = false;
            this.$eventBus.$emit("focus-home-setup");
        },

        removeRoom() {
            if (this.keepRoomDevices) {
                const devicesInRoom = this.currentSetup.devices.filter(product => product.room === this.removingRoom.name);
                devicesInRoom.forEach(device => device.room = this.deviceTray);
            } else {
                this.currentSetup.devices = this.currentSetup.devices.filter(product => product.room !== this.removingRoom.name);
            }

            const roomIndex = this.currentSetup.rooms.findIndex(room => room.name.toLowerCase() === this.removingRoom.name.toLowerCase());
            this.currentSetup.rooms.splice(roomIndex, 1);
            this.$emit("removed-room");
            this.bsModal.hide();
        }
    },

    mounted() {
        this.bsModal = new Modal("#remove-room-modal");

        const domModal = document.getElementById("remove-room-modal");
        domModal.addEventListener("hidden.bs.modal", this.resetModal);
    },

    beforeUnmount() {
        const domModal = document.getElementById("remove-room-modal");
        domModal.removeEventListener("hidden.bs.modal", this.resetModal);
    }
};
</script>

<style scoped>
strong {
    font-weight: 600;
}

.devices-button-group {
    display: block;
    margin-top: 0.7rem;
}

.devices-button {
    padding: 0.4rem 1rem;
    text-align: left;
    --bs-btn-color: #222;
    --bs-btn-hover-color: #222;
    --bs-btn-hover-bg: var(--gray-button-hover);
    --bs-btn-border-color: darkgray;
    --bs-btn-hover-border-color: var(--bs-btn-border-color);
}

.radio-label-header {
    display: block;
    margin-bottom: 0.2rem;
    font-size: 0.98rem;
}

.radio-label-body {
    display: block;
    margin-bottom: 0.2rem;
    font-weight: 400;
    font-size: 0.95rem;
    line-height: 1.3;
}

.btn-check:checked, .btn-check:focus {
    color: red !important;
}
</style>
