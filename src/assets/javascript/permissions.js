import Events from "@/assets/javascript/events";
import { useProductsStore } from "@/stores/products-store";

/**
 * Checks whether the user can commit various actions in SHWA. Used for the study setups.
 * Will also send an event on the {@link EventBus} to display a notification when an action is not allowed.
 */
class Permissions {
    IDs = {
        philipsHueBridgeLocalId: "c0bad215-c7d5-41f7-8ef5-3ab127350694",
        oldLampLocalId: "abf33fec-1753-41f3-bec6-12a7de40a918"
    }

    /**
     * Initializes the {@link Permissions} object. To be called at mount time by App.vue.
     *
     * @param {string} setupName
     * @param {boolean} studySetup
     * @param {EventBus} eventBus
     */
    init(setupName, studySetup, eventBus) {
        this.setupName = setupName;
        this.studySetup = studySetup;
        this.setupNumber = studySetup ? setupName.match(/\d/)?.[0] : null;
        this.eventBus = eventBus;
    }

    /**
     * Checks whether the given product may be added to the setup.
     *
     * @param {Object} product
     * @returns {boolean}
     */
    addProduct(product) {
        switch (this.setupNumber) {
            case "1":
                if (product.category !== "light" || (!product.network.zigbee && !product.network.lan)) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "2":
                if (!product.category.includes("sensor") || (!product.network.zigbee && !product.network.lan)) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }

    /**
     * Checks whether the given device may be replaced.
     *
     * @param {Device} device
     * @returns {boolean}
     */
    replaceDevice(device) {
        switch (this.setupNumber) {
            case "1":
            case "2":
                if (device.localId === this.IDs.philipsHueBridgeLocalId) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }

    /**
     * Checks whether the given device may be moved.
     *
     * @param {Device} device
     * @returns {boolean}
     */
    moveDevice(device) {
        switch (this.setupNumber) {
            case "1":
                if (device.localId === this.IDs.oldLampLocalId) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }

    /**
     * Checks whether the given device may be removed.
     *
     * @param {Device} device
     * @returns {boolean}
     */
    removeDevice(device) {
        switch (this.setupNumber) {
            case "1":
            case "2":
                const product = useProductsStore().allProducts[device.productId];
                if (["hub", "light"].some(category => product.category === category)) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }

    /**
     * Checks whether the given room may be removed.
     *
     * @param {Object} room
     * @returns {boolean}
     */
    removeRoom(room) {
        switch (this.setupNumber) {
            case "1":
                if (["Living Room", "Bedroom"].some(roomName => room.name === roomName)) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "2":
                if (["Living Room", "Bedroom", "Foyer"].some(roomName => room.name === roomName)) {
                    this.eventBus.$emit(Events.ILLEGAL_ACTION);
                    return false;
                }
                return true;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }

    /**
     * Checks whether the setup controls may be set to the given value.
     *
     * @param {Object} newControls
     * @returns {boolean}
     */
    modifyControls(newControls) {
        switch (this.setupNumber) {
            case "1":
            case "2":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            case "3":
            case "4":
                this.eventBus.$emit(Events.ILLEGAL_ACTION);
                return false;
            default:
                return true;
        }
    }
}

export default new Permissions();
