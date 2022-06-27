<template>
    <div class="m-0">
        <div class="modal fade" id="add-room-modal" tabindex="-1" aria-labelledby="add-room-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="add-room-modal-label">Enter New Room Name</h5>
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
                        <button type="submit" class="btn btn-primary" form="add-room-form">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from "bootstrap";
import { capitalize } from "vue";

export default {
    name: "AddRoomModal",

    data() {
        return {
            roomModal: null,
            roomForm: null,
            roomInput: null,

            errorBorder: false,
            errorMsg: "",

            newRoomLocation: null
        };
    },

    props: {
        setupRooms: {
            type: Array,
            required: true
        }
    },

    emits: ["room-added"],

    methods: {
        onInput() {
            if (this.errorBorder) {
                this.errorBorder = false;
            }
        },

        resetForm() {
            this.errorBorder = false;
            this.errorMsg = "";
            this.newRoomLocation = null;
            this.roomForm.reset();
        },

        openModal(addRoomButton) {
            this.roomModal.show();
            this.newRoomLocation = addRoomButton.location;
        },

        submitRoom() {
            const input = this.roomInput.value;

            // Check if input is empty
            if (!input) {
                this.errorBorder = true;
                this.errorMsg = "Please enter a room name.";
                this.roomInput.focus();
                return;
            }

            // Check if room already exists
            const matches = this.setupRooms.filter(room => room.name.toLowerCase() === input.toLowerCase());
            if (matches.length > 0) {
                this.errorBorder = true;
                this.errorMsg = `Your Home already has a "${matches[0].name}".`;
                this.roomInput.focus();
                return;
            }

            this.roomModal.hide();
            this.setupRooms.push({
                name: capitalize(input),
                location: {...this.newRoomLocation}
            });
            this.$emit("room-added");
        }
    },

    mounted() {
        this.roomModal = new Modal("#add-room-modal");
        this.roomForm = document.getElementById("add-room-form");
        this.roomInput = document.getElementById("room-input");

        const domModal = document.getElementById("add-room-modal");
        domModal.addEventListener("shown.bs.modal", () => this.roomInput.focus());
        domModal.addEventListener("hidden.bs.modal", () => this.resetForm());
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
