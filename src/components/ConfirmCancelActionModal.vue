<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Cancel action?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Leaving the {{ currentViewText }} page now will cancel your current action: <strong>{{ viewStateText }}</strong>.<br>
                        Are you sure you want to continue?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="stayOnPage">Stay on page</button>
                        <button type="button" class="btn btn-danger" @click="leavePage">Leave page</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";
import Events from "@/assets/javascript/events";

export default {
    name: "ConfirmCancelActionModal",

    data() {
        return {
            bsModal: null,
            switchTarget: null
        };
    },

    props: {
        currentView: String,
        viewState: String,
        replaceProduct: Object
    },

    emits: [Events.CANCEL_ACTION, Events.FOCUS_HOME_SETUP],

    computed: {
        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        },

        currentViewText() {
            return this.currentView.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
        },

        viewStateText() {
            if (this.currentView === "HomeSetup") {
                switch (this.viewState) {
                    case "adding-room":
                        return "adding a new room";
                    case "removing-room":
                        return "removing a room";
                    case "moving-device":
                        return "moving one of your devices";
                }
            } else if (this.currentView === "ProductDatabase") {
                return `choosing a replacement for your ${this.replaceProduct?.brand} ${this.replaceProduct?.model}`;
            }
        }
    },

    methods: {
        openModal(switchTarget) {
            this.switchTarget = switchTarget;
            this.bsModal.show();
        },

        resetModal() {
            this.switchTarget = null;
            if (this.currentView === "HomeSetup") {
                this.$eventBus.$emit(Events.FOCUS_HOME_SETUP);
            }
        },


        // Button callbacks

        stayOnPage() {
            this.bsModal.hide();
        },

        leavePage() {
            this.$emit(Events.CANCEL_ACTION, this.switchTarget);
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
strong {
    font-weight: 600;
}

.modal-body {
    text-align: center;
}
</style>
