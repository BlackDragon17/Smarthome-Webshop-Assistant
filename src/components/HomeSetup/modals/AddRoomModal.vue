<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" id="add-room-modal" tabindex="-1" aria-labelledby="add-room-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="add-room-modal-label">Enter New Room name</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="add-room-form" @submit.prevent="submitRoom" class="row">
                            <label for="room-input" class="col-form-label col-sm-auto">Room name:</label>
                            <div class="col" style="padding-left: 0.4rem">
                                <input type="text"
                                       id="room-input"
                                       @input="onInput"
                                       class="form-control col-sm-auto"
                                       :class="{'is-invalid': errorBorder}">
                                <p v-show="errorMsg" class="error-message">
                                    <span class="inline-icon material-symbols-rounded">error</span>
                                    {{ errorMsg }}
                                </p>
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
            roomForm: null,
            roomInput: null,

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

    methods: {
        onInput() {
            if (this.errorBorder) {
                this.errorBorder = false;
            }
        },

        focusForm() {
            if (this.roomViewState === "normal") {
                this.bsModal.hide();
                return;
            }
            this.roomInput.focus();
        },

        openModal(addRoomButton) {
            this.bsModal.show();
            this.newRoomLocation = addRoomButton.location;
        },

        resetModal() {
            this.errorBorder = false;
            this.errorMsg = "";
            this.newRoomLocation = null;
            this.roomForm.reset();
            this.$eventBus.$emit(Events.FOCUS_HOME_SETUP);
        },

        submitRoom() {
            const input = this.roomInput.value.trim();

            // Check if input is empty
            if (!input) {
                this.errorBorder = true;
                this.errorMsg = "Please enter a room name.";
                this.roomInput.value = "";
                this.roomInput.focus();
                return;
            }

            // Check if room already exists
            const match = this.setupRooms.find(room => room.name.toLowerCase() === input.toLowerCase());
            if (match) {
                this.errorBorder = true;
                this.errorMsg = `Your Home already has a "${match.name}".`;
                this.roomInput.value = input;
                this.roomInput.focus();
                return;
            }

            this.setupRooms.push({
                name: capitalize(input),
                location: {...this.newRoomLocation}
            });
            this.$emit(Events.ADDED_ROOM);
            this.bsModal.hide();
        }
    },

    mounted() {
        this.bsModal = new Modal("#add-room-modal");
        this.roomForm = document.getElementById("add-room-form");
        this.roomInput = document.getElementById("room-input");

        const domModal = document.getElementById("add-room-modal");
        domModal.addEventListener("shown.bs.modal", this.focusForm);
        domModal.addEventListener("hidden.bs.modal", this.resetModal);
    },

    beforeUnmount() {
        const domModal = document.getElementById("add-room-modal");
        domModal.removeEventListener("shown.bs.modal", this.focusForm);
        domModal.removeEventListener("hidden.bs.modal", this.resetModal);
    }
};
</script>

<style scoped>
.error-message {
    margin-top: 0.4rem;

    color: var(--bs-red);
    font-size: 0.95rem;
    font-weight: 600;
}
</style>
