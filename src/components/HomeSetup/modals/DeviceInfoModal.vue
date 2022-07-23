<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" id="device-info-modal" tabindex="-1" aria-labelledby="device-info-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="device-info-modal-label">Device info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        device productId: {{ device?.productId }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
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
    name: "DeviceInfoModal",

    data() {
        return {
            bsModal: null,

            device: null,
            product: null
        };
    },

    props: {
        setupDevices: Array,
    },

    emits: ["focus-home-setup"],

    methods: {
        openModal(device) {
            this.device = device;
            this.product = null;
            this.bsModal.show();
        },

        resetModal() {
            this.device = null;
            this.product = null;
            this.$eventBus.$emit("focus-home-setup");
        }
    },

    mounted() {
        this.bsModal = new Modal("#device-info-modal");

        const domModal = document.getElementById("device-info-modal");
        domModal.addEventListener("hidden.bs.modal", this.resetModal);
    },

    beforeUnmount() {
        const domModal = document.getElementById("device-info-modal");
        domModal.removeEventListener("hidden.bs.modal", this.resetModal);
    }
};
</script>

<style scoped></style>
