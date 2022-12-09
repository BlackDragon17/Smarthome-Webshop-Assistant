<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + '-label'">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalId + '-label'">Enter New Room name</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="add-room-form" class="row" @submit.prevent="submitRoom">
                            <label for="name-input" class="col-form-label col-sm-auto">Room name:</label>
                            <div class="col" style="padding-left: 0.4rem">
                                <input type="text"
                                       ref="nameInput"
                                       id="name-input"
                                       class="form-control col-sm-auto"
                                       :class="{'is-invalid': errorBorder}"
                                       @input="onNameInput">
                                <div v-show="errorMsg" class="error-message">
                                    <span class="error-icon inline-icon material-symbols-rounded">error</span>
                                    <span>{{ errorMsg }}</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" form="add-room-form">Add room</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from "vue";
import Modal from "bootstrap/js/dist/modal";
import Events from "@/assets/javascript/events";

export default {
    name: "AddRoomModal",

    data() {
        return {
            bsModal: null,

            errorBorder: false,
            errorMsg: "",

            newRoomLocation: null
        };
    },

    props: {
        roomViewState: String,
        setupRooms: Array
    },

    emits: [Events.ADDED_ROOM, Events.FOCUS_HOME_SETUP],

    computed: {
        modalId() {
            return this.$options.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        }
    },

    methods: {
        openModal(addRoomButton) {
            this.bsModal.show();
            this.newRoomLocation = addRoomButton.location;
        },

        resetModal() {
            this.errorBorder = false;
            this.errorMsg = "";
            this.$refs.nameInput.value = "";
            this.newRoomLocation = null;
            this.$eventBus.$emit(Events.FOCUS_HOME_SETUP);
        },

        submitRoom() {
            const input = this.$refs.nameInput.value.trim();

            // Check if input is empty
            if (!input) {
                this.displayInputError("Please enter a room name.");
                return;
            }

            // Check for illegal names
            if (input.toLowerCase() === this.deviceTray.toLowerCase()) {
                this.displayInputError("This name is reserved, please choose a different one.", false);
                return;
            }

            // Check if room already exists
            const match = this.setupRooms.find(room => room.name.toLowerCase() === input.toLowerCase());
            if (match) {
                this.displayInputError(`Your Home already has a "${match.name}".`);
                return;
            }

            this.setupRooms.push({
                name: capitalize(input),
                location: {...this.newRoomLocation}
            });
            this.$emit(Events.ADDED_ROOM);
            this.bsModal.hide();
        },

        onNameInput() {
            if (this.errorBorder) {
                this.errorBorder = false;
            }
        },

        focusForm() {
            if (this.roomViewState === "normal") {
                this.bsModal.hide();
                return;
            }
            this.$refs.nameInput.focus();
        },

        /**
         * Displays an error message under the name input and resets its value.
         *
         * @param {string} inputError the error to display under the user input.
         * @param {boolean} [resetInput] whether the input field should be reset.
         */
        displayInputError(inputError, resetInput = true) {
            this.errorBorder = true;
            this.errorMsg = inputError;
            if (resetInput) {
                this.$refs.nameInput.value = "";
            }
            this.$refs.nameInput.focus();
        }
    },

    mounted() {
        this.bsModal = new Modal("#" + this.modalId);

        const domModal = document.getElementById(this.modalId);
        domModal.addEventListener("shown.bs.modal", this.focusForm);
        domModal.addEventListener("hidden.bs.modal", this.resetModal);
    },

    beforeUnmount() {
        const domModal = document.getElementById(this.modalId);
        domModal.removeEventListener("shown.bs.modal", this.focusForm);
        domModal.removeEventListener("hidden.bs.modal", this.resetModal);
    }
};
</script>

<style scoped>
.error-message {
    margin-top: 0.4rem;
    margin-left: -0.1rem;

    color: var(--bs-red);
    font-size: 0.95rem;
    font-weight: 600;

    display: flex;
    flex-direction: row;
}

.error-icon {
    padding-right: 0.3rem;
}
</style>
