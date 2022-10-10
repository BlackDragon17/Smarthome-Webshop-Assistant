<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Modify your controls</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-subheader">Please select which assistant or apps you are using to control your smart home.</p>
                        <h6 class="group-header">Assistants</h6>
                        <p class="group-subheader">Cross-device assistant ecosystems</p>
                        <v-select :options="['a', 'b']"/>
                        <h6 class="group-header mt-3">Vendor apps</h6>
                        <p class="group-subheader">Device vendor-specific applications</p>
                        <v-select :options="['a', 'b']"/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
    name: "ModifyControlsModal",

    components: {
        vSelect
    },

    data() {
        return {
            bsModal: null
        };
    },

    computed: {
        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        }
    },

    methods: {
        openModal() {
            this.bsModal.show();
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
.modal-subheader {
    font-size: 1.03rem;
}

.group-header {
    margin: 0.9rem 0 0.2rem;
    font-size: 1.15rem;
    font-weight: 500;
}

.group-subheader {
    margin-bottom: 0.5rem;
    font-style: italic;
}
</style>
