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
                        <p class="modal-subheader">Please select which assistants or apps you are using to control your smart home devices.</p>

                        <h6 class="group-header">Assistants</h6>
                        <p class="group-subheader">Cross-device assistant ecosystems</p>
                        <v-select multiple
                                  v-model="selectedAssistants"
                                  :options="assistantOptions"
                                  :reduce="option => option.key"
                                  @input="onInput"
                                  @option:selected="onInput"
                                  class="vselect-general"
                                  :class="{'vselect-error-border': showError}"/>

                        <h6 class="group-header" style="margin-top: 1.1rem">Vendor apps</h6>
                        <p class="group-subheader">Device vendor-specific smartphone apps</p>
                        <v-select multiple
                                  v-model="selectedBrandApps"
                                  :options="allBrands"
                                  @input="onInput"
                                  @option:selected="onInput"
                                  class="vselect-general"
                                  :class="{'vselect-error-border': showError}"/>

                        <p v-show="showError" class="error-message">
                            <span class="inline-icon material-symbols-rounded" style="margin-bottom: -1px">error</span>
                            Please select at least one valid method of control.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="saveSelections">Save</button>
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
            bsModal: null,
            selectedAssistants: [],
            selectedBrandApps: [],
            showError: false
        };
    },

    props: {
        setupControls: Object
    },

    inject: ["allBrands"],

    computed: {
        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        },

        assistantOptions() {
            const options = [];
            for (const assistant of Object.keys(this.$getName.allAssistants)) {
                options.push({
                    label: this.$getName.allAssistants[assistant],
                    key: assistant
                });
            }
            return options.sort((a, b) => {
                if (a.label === b.label) {
                    return 0;
                }
                return a.label > b.label ? 1 : -1;
            });
        }
    },

    methods: {
        openModal() {
            this.selectedAssistants = [...this.setupControls.assistants];
            this.selectedBrandApps = [...this.setupControls.brandApps];
            this.bsModal.show();
        },

        resetModal() {
            this.selectedAssistants = [];
            this.selectedBrandApps = [];
            this.showError = false;
        },

        onInput() {
            console.log("onInput");
            if (this.showError) {
                this.showError = false;
            }
        },

        saveSelections() {
            if (this.selectedAssistants.length <= 0 && this.selectedBrandApps <= 0) {
                this.showError = true;
                return;
            }

            this.setupControls.assistants = [...this.selectedAssistants];
            this.setupControls.brandApps = [...this.selectedBrandApps];
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

.vselect-general {
    --vs-border-radius: var(--bs-border-radius);
    --vs-line-height: 1.6;
}

.vselect-error-border {
    --vs-border-color: var(--bs-red);
}

.error-message {
    margin-top: 0.6rem;
    margin-bottom: -0.1rem;

    color: var(--bs-red);
    font-size: 0.95rem;
    font-weight: 600;
}
</style>
