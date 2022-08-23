<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Confirm cancel</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        aaa
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" v-if="device?.room !== deviceTray" @click="replaceDevice">
                            Get compatible replacement
                        </button>
                        <button type="button" class="btn btn-success" v-if="device?.room === deviceTray" @click="moveDevice">Add to a room</button>
                        <button type="button" class="btn btn-secondary" v-else @click="moveDevice">Move to a new&nbsp;spot</button>
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
    name: "ConfirmCancelActionModal",

    data() {
        return {
            bsModal: null
        };
    },

    props: {
        currentView: String,
        currentAction: String,
    },

    computed: {
        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        },

        cancelMsgText() {
            if (this.currentView === "HomeSetup") {
                switch (this.currentAction) {
                    case "":
                        return "";
                }
            } else if (this.currentView === "ProductDatabase") {
                switch (this.currentAction) {
                    case "":
                        return "";
                }
            }
        }
    },

    methods: {
        openModal() {
            this.bsModal.show();
        },

        resetModal() {
            if (this.currentView === "HomeSetup") {
                this.$eventBus.$emit("focus-home-setup");
            }
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

</style>
