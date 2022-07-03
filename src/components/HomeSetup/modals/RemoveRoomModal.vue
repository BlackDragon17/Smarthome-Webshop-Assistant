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
                        Content
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
import { Modal } from "bootstrap";

export default {
    name: "RemoveRoomModal",

    data() {
        return {
            roomModal: null
        };
    },

    props: {
        setupRooms: {
            type: Array,
            required: true
        },
        roomViewState: {
            type: String,
            required: true
        }
    },

    emits: ["room-removed"],

    methods: {
        openModal(removeRoomButton) {
            this.roomModal.show();
        },
    },

    mounted() {
        this.roomModal = new Modal("#remove-room-modal");
    }
};
</script>

<style scoped></style>
