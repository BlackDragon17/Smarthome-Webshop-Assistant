/**
 * A DTO representing a home setup device.
 */
export default class Device {
    /**
     * Creates a new device DTO from scratch.
     * @param {string} room The setup room in which the device is located (can also be deviceTray).
     * @param {number} location Represents the location inside the room: 1 = top left, 9 = bottom right.
     * @param {string} productId ID of the product associated with this device.
     * @param {string} [localId] Unique device ID. Will be auto-generated if undefined.
     */
    constructor(room, location, productId, localId) {
        if (!room || !location || !productId) {
            throw new Error("Can't construct device: bad parameters.");
        }
        this.room = room;
        this.location = location;
        this.productId = productId;
        this.localId = localId ?? crypto.randomUUID();
    }

    /**
     * Creates a new device DTO from a given device or product.
     * Will reuse the available localId if a device object is passed.
     * @param {Device|Object} obj A device or product object.
     * @param {string} room The setup room in which the device is located (can also be deviceTray).
     * @param {number} location Represents the location inside the room: 1 = top left, 9 = bottom right.
     */
    static createFromDTO(obj, room, location) {
        if (obj instanceof Device) {
            return new Device(room, location, obj.productId, obj.localId);
        }
        return new Device(room, location, obj.productId, null);
    }

    /**
     * Returns a new device DTO from a pre-verified device JSON object.
     */
    static createFromJson({room, location, productId, localId}) {
        return new Device(room, location, productId, localId);
    }
}
