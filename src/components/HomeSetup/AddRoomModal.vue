<template>
    <div class="no-margin">
        <div class="modal fade" id="add-room-modal" tabindex="-1" aria-labelledby="add-room-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="add-room-modal-label">Add new Room</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="add-room-form" @submit.prevent="submitRoom">
                            <label for="room-input">Room name:</label>
                            <input type="text" id="room-input">
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" form="add-room-form">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
    name: "AddRoomModal",

    data() {
        return {
            roomModal: null,
            roomForm: null
        };
    },

    props: {
        setupRooms: {
            type: Array,
            required: true
        }
    },

    methods: {
        submitRoom(event) {
            const input = event.target[0].value;
            const matches = this.setupRooms.filter(room => room.toLowerCase() === input.toLowerCase());
            if (matches.length > 0) {
                console.log("exists:", matches[0]);
            } else {
                console.log("exists not");
                this.roomModal.hide();
            }
        }
    },

    mounted() {
        this.roomModal = new Modal("#add-room-modal");
        this.roomForm = document.getElementById("add-room-form");
        document.getElementById("add-room-modal")
            .addEventListener("hidden.bs.modal", () => this.roomForm.reset());
    }
};
</script>

<style scoped>
#room-input {
    margin: 0.6rem 2rem;
}
</style>
