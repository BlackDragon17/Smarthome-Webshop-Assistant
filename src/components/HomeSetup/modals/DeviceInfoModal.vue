<template>
    <div class="m-0" @keydown.esc.stop @click.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Device info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="inline-icon material-symbols-rounded">
                            {{ $getName.categoryIcon(product?.category) }}
                        </div>
                        {{ product?.brand }} {{ product?.model }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" v-if="showReplaceAndMoveButtons" class="btn btn-success" @click="getReplacement">
                            Get compatible replacement
                        </button>
                        <button type="button" v-if="showAddToRoomButton" class="btn btn-success" @click="moveDevice">
                            Add to a room
                        </button>
                        <button type="button" v-if="showReplaceAndMoveButtons" class="btn btn-secondary" @click="moveDevice">
                            Move to a new&nbsp;spot
                        </button>
                        <button type="button" class="btn btn-danger" @click="removeDevice">Delete device</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";

export default {
    name: "DeviceInfoModal",

    data() {
        return {
            bsModal: null,

            device: null,
            product: null
        };
    },

    props: {
        currentDevices: Array,
        deviceQueue: Array,
        setupHasRooms: Boolean
    },

    emits: ["move-device", "device-removed", "focus-home-setup"],

    inject: ["allProducts"],

    computed: {
        showAddToRoomButton() {
            return this.device?.room === this.deviceTray && this.setupHasRooms;
        },
        showReplaceAndMoveButtons() {
            return this.device?.room !== this.deviceTray && this.setupHasRooms;
        },

        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        }
    },

    methods: {
        openModal(device) {
            this.device = device;
            this.product = this.allProducts[device.productId];
            this.bsModal.show();
        },

        resetModal() {
            this.device = null;
            this.product = null;
            this.$eventBus.$emit("focus-home-setup");
        },


        // Button callbacks

        getReplacement() {
            if (!this.$permissions.replaceDevice(this.device)) {
                return;
            }

            this.$eventBus.$emit("get-replacement", this.device);
            this.bsModal.hide();
        },

        moveDevice() {
            if (!this.$permissions.moveDevice(this.device)) {
                return;
            }

            const deviceIndex = this.currentDevices.findIndex(device => device.localId === this.device.localId);
            this.currentDevices.splice(deviceIndex, 1);
            this.deviceQueue.push(this.device);
            this.$eventBus.$emit("move-device");
            this.bsModal.hide();
        },

        removeDevice() {
            if (!this.$permissions.removeDevice(this.device)) {
                return;
            }

            const deviceIndex = this.currentDevices.findIndex(device => device.localId === this.device.localId);
            this.currentDevices.splice(deviceIndex, 1);
            this.$emit("device-removed");
            this.bsModal.hide();
        }
    },

    mounted() {
        this.bsModal = new Modal("#" + this.modalId);

        const domModal = document.getElementById(this.modalId);
        domModal.addEventListener("hidden.bs.modal", this.resetModal);
    },

    beforeUnmount() {
        const domModal = document.getElementById(this.modalId);
        domModal.removeEventListener("hidden.bs.modal", this.resetModal);
    }
};
</script>

<style scoped>
.modal-footer {
    border: none;

    flex-wrap: nowrap;
    justify-content: center;
}

button.btn {
    margin: 0 0.25rem;
    padding: 0.2rem 0.75rem 0.4rem;
    line-height: 1.3;
    max-width: max-content;
}

@media screen and (min-width: 520px) {
    button.btn {
        margin: 0 0.5rem;
    }
}

@media screen and (max-width: 380px) {
    .modal-footer {
        padding: 0.75rem 0.1rem;
    }
}
</style>
