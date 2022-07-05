<template>
    <div class="m-0" @keydown.esc.stop>
        <div class="modal fade" id="remove-room-modal" tabindex="-1" aria-labelledby="remove-room-modal-label">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="remove-room-modal-label">Confirm room removal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to remove the "<strong>{{ removingRoom?.name }}</strong>" from your home?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="removeRoom">Remove</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
    name: "RemoveRoomModal",

    data() {
        return {
            roomModal: null,

            removingRoom: null
        };
    },

    props: {
        currentSetup: {
            type: Object,
            required: true
        },
        roomViewState: {
            type: String,
            required: true
        }
    },

    emits: ["room-removed", "focus-home-setup"],

    methods: {
        openModal(removingRoom) {
            this.removingRoom = removingRoom;
            this.roomModal.show();
        },

        resetModal() {
            this.removingRoom = null;
            this.$eventBus.$emit("focus-home-setup");
        },

        removeRoom() {
            const roomIndex = this.currentSetup.rooms.findIndex(room => room.name.toLowerCase() === this.removingRoom.name.toLowerCase());

            this.roomModal.hide();
            this.currentSetup.rooms.splice(roomIndex, 1);
            this.$emit("room-removed");
        }
    },

    mounted() {
        this.roomModal = new Modal("#remove-room-modal");

        const domModal = document.getElementById("add-room-modal");
        domModal.addEventListener("hidden.bs.modal", () => this.resetModal());
    }
};
</script>

<style scoped>
strong {
    font-weight: 600;
}
</style>
