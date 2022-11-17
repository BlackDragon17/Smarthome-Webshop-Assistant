export default class PauseableTimeout {
    /**
     * Creates a new {@link PauseableTimeout} and starts it.
     *
     * @param {Function} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;
        this.startTime = Date.now();
        this.timerId = setTimeout(callback, delay);
    }

    /**
     * Clears the timeout and makes it not runnable again.
     */
    clearTimeout() {
        if (this.timerId == null) {
            return;
        }
        clearTimeout(this.timerId);
        this.timerId = null;
        this.remaining = -1;
    }

    /**
     * Pauses the timeout.
     */
    pause() {
        if (this.timerId == null || this.remaining < 0) {
            return;
        }
        clearTimeout(this.timerId);
        this.timerId = null;
        this.remaining -= Date.now() - this.startTime;
    }

    /**
     * Resumes the timeout.
     */
    resume() {
        if (this.timerId != null || this.remaining < 0) {
            return;
        }
        this.startTime = Date.now();
        this.timerId = setTimeout(this.callback, this.remaining);
    }
}
