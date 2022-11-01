<template>
    <div v-if="tutorialStep === 1" class="tutorial-curtain curtain-dark-bg">
        <div class="tutorial-tooltip">
            <h5 class="tooltip-heading">
                Welcome to SHWA!
            </h5>
            <p class="tooltip-text">
                This short tutorial will show you the most import sections of the app.
            </p>
            <div class="tooltip-footer">
                <button class="tooltip-button btn btn-success" @click="prepareNextTooltip">Next</button>
                <span class="tooltip-counter">1 / 4</span>
            </div>
        </div>
    </div>
    <div v-else-if="tutorialStep === 2" class="tutorial-curtain" tabindex="-1">
        <div class="tutorial-tooltip">
            <p class="tooltip-text">
                The main page of the app displays a blueprint-like view of a user's home.
            </p>
            <p class="tooltip-text">
                It shows the rooms of the house as well as the smart devices within them.
            </p>
            <div class="tooltip-footer">
                <button class="tooltip-button btn btn-success" @click="prepareNextTooltip">Next</button>
                <span class="tooltip-counter">2 / 4</span>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import FocusTrap from "bootstrap/js/dist/util/focustrap";

export default {
    name: "TutorialTooltips",

    data() {
        return {
            tutorialStep: 0,
            currentFocustrap: null,
            floatCleanup: null
        };
    },

    methods: {
        async prepareNextTooltip() {
            this.tutorialStep++;
            await nextTick();

            let highlightedEl = null;
            const currentTooltip = document.querySelector("div.tutorial-tooltip");
            if (this.currentFocustrap) {
                this.currentFocustrap.deactivate();
            }
            if (currentTooltip) {
                this.currentFocustrap = new FocusTrap({trapElement: currentTooltip});
                this.currentFocustrap.activate();
            }

            switch (this.tutorialStep) {
                case 1:
                    // step needs no prep
                    break;
                case 2:
                    highlightedEl = document.querySelector("section.room-view");
                    highlightedEl.classList.add("tutorial-element-highlight");
                    break;
                case 3:
                    highlightedEl = document.querySelector("section.room-view");
                    highlightedEl.classList.remove("tutorial-element-highlight");
                    break;
            }
        },

        floatTooltip(targetEl) {
            // https://github.com/floating-ui/floating-ui/issues/1769
        }
    },

    mounted() {
        this.prepareNextTooltip();
    }
};
</script>

<style>
.tutorial-element-highlight {
    box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4);
    z-index: 5;
}
</style>

<style scoped>
.tutorial-curtain {
    width: 100vw;
    height: 100vh;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 6;
}

.curtain-dark-bg {
    background-color: rgba(0, 0, 0, 0.4);
}

.tutorial-tooltip {
    width: 20rem;
    padding: 15px;

    border-radius: 0.5rem;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.45);
    background-color: var(--green-tooltip-bg);
    color: white;

    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 -50% -50% 0;
    transform: translate(-50%, -50%);
}

.tooltip-heading {
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
}

.tooltip-text {
    margin-bottom: 0.3rem;
    font-family: Jost, sans-serif;
    font-size: 1.1rem;
    line-height: 1.3;
}

.tooltip-footer {
    margin-top: 0.7rem;
    display: flex;
}

.tooltip-button {
    --bs-btn-bg: var(--green-devices-main-darker2);
    --bs-btn-hover-bg: var(--green-devices-main-darker3);
    --bs-btn-active-bg: var(--green-devices-main-darker4);
}

.tooltip-counter {
    margin-left: auto;
    padding-top: 0.2rem;
    display: inline-flex;
    align-items: center;
}
</style>
