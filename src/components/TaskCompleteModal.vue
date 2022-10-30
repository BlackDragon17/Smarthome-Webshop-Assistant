<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Task complete</h5>
                    </div>
                    <div class="modal-body">
                        <div class="checkmark-icon material-symbols-rounded">check_circle</div>
                        <p class="completion-text">Task completed successfully! 😀</p>
                        <p class="completion-text">You can now proceed to the next page of the survey<br>using the "Next" button below.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";

export default {
    name: "TaskCompleteModal",

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
        openModal(postMsg) {
            this.bsModal.show();
            if (postMsg && window !== window.parent) {
                window.parent.postMessage("task-complete", "https://umtlstudies.dfki.de/limesurvey/");
            }
        }
    },

    mounted() {
        this.bsModal = new Modal("#" + this.modalId, {
            backdrop: "static",
            keyboard: false
        });

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
.checkmark-icon {
    display: block;
    margin-bottom: 0.6rem;

    color: var(--bs-green);
    text-align: center;
    font-size: 5.5rem;
    font-weight: 350;
}

.completion-text {
    margin-top: 0.4rem;

    text-align: center;
    font-size: 1.1rem;
}
</style>
