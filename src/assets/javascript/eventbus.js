class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * @param {string} eventName
     * @param {Function} fn
     */
    $on(eventName, fn) {
        if (!eventName) {
            throw new Error(`Invalid eventName given: ${eventName}`);
        }
        if (!fn) {
            throw new Error(`Invalid callback funtion given: ${fn}`);
        }

        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    /**
     * @param {string} eventName
     * @param {Function} fn
     */
    $off(eventName, fn) {
        if (!eventName) {
            throw new Error(`Invalid eventName given: ${eventName}`);
        }
        if (!fn) {
            throw new Error(`Invalid callback funtion given: ${fn}`);
        }

        if (this.events[eventName]) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * @param {string} eventName
     * @param {any} [data]
     */
    $emit(eventName, data) {
        if (!eventName) {
            throw new Error(`Invalid eventName given: ${eventName}`);
        }

        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(data));
        }
    }
}

export default new EventBus();
