/**
 * An enum for all custom events used in the application.
 */
const Events = {
    HEADER_CLICK: "header-click",
    CHANGE_VIEW: "change-view",
    VIEW_CHANGED: "view-changed",

    FOCUS_HOME_SETUP: "focus-home-setup",
    CHANGE_STATE: "change-state",
    ROOM_VIEW_CANCEL: "room-view-cancel",

    GET_NEW_PRODUCT: "get-new-product",
    ADD_NEW_DEVICE: "add-new-device",
    ADDED_DEVICE: "added-device",
    GET_REPLACEMENT: "get-replacement",
    REPLACE_DEVICE: "replace-device",
    MOVE_DEVICE: "move-device",
    DEVICE_REMOVED: "device-removed",

    ADDED_ROOM: "added-room",
    REMOVE_ROOM: "remove-room",
    REMOVED_ROOM: "removed-room",

    CANCEL_ACTION: "cancel-action",
    ILLEGAL_ACTION: "illegal-action",

    POPOVER_SHOWN: "popover-shown",
    POPOVER_HIDE: "popover-hide",

    OPEN_DEVICE_INFO: "open-device-info",
    SHOW_TOOLTIP: "show-tooltip",

    PRINT_DEBUG: "print-debug",

    // postMessage study events
    TASK_SUCCESSFUL: "task-successful",
    TASK_FAILED: "task-failed",
    RESET_STATE: "reset-state"
};

export default Events;
