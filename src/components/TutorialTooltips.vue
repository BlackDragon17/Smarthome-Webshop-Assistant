<template>
    <div v-if="tutorialStep > 0" class="tutorial-curtain" :class="{'curtain-dark-bg': tooltipContent.fixedCenter}">
        <div ref="tooltipBody" class="tutorial-tooltip" :class="{'tooltip-fixed-center': tooltipContent.fixedCenter}">
            <h5 class="tooltip-heading" v-if="tooltipContent.heading">
                {{ tooltipContent.heading }}
            </h5>
            <p class="tooltip-text" v-for="parahraph in tooltipContent.paragraphs">
                {{ parahraph }}
            </p>
            <div class="tooltip-footer">
                <button class="tooltip-button btn btn-success" @click="prepareNextTooltip">Next</button>
                <span class="tooltip-counter">{{ tutorialStep }} / 4</span>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import { autoUpdate, computePosition, offset, arrow } from "@floating-ui/dom";
import FocusTrap from "bootstrap/js/dist/util/focustrap";

export default {
    name: "TutorialTooltips",

    data() {
        return {
            tutorialStep: 0,
            tooltipContent: {heading: null, paragraphs: [], fixedCenter: false},

            currentFocustrap: null,
            floatCleanup: null
        };
    },

    methods: {
        async prepareNextTooltip() {
            this.tutorialStep++;
            await nextTick();

            if (this.floatCleanup) {
                this.floatCleanup();
                this.floatCleanup = null;
            }

            if (this.currentFocustrap) {
                this.currentFocustrap.deactivate();
            }
            this.currentFocustrap = new FocusTrap({trapElement: this.$refs.tooltipBody});
            this.currentFocustrap.activate();

            let highlightedEl = null;
            this.tooltipContent = {heading: null, paragraphs: [], fixedCenter: false};
            this.$refs.tooltipBody.style.transform = "";

            switch (this.tutorialStep) {
                case 1:
                    this.tooltipContent = {
                        heading: "Welcome to SHWA!",
                        paragraphs: ["This short tutorial will show you the most import sections of the app."],
                        fixedCenter: true
                    };
                    break;

                case 2:
                    this.tooltipContent.paragraphs = [
                        "The main page of the app displays a blueprint-like view of a user's home.",
                        "It shows the rooms of the house as well as the smart devices within them."
                    ];

                    highlightedEl = document.querySelector("section.room-view");
                    highlightedEl.classList.add("tutorial-element-highlight");

                    const floatTarget = document.querySelector("div.room[style=\"grid-area: 1 / 2 / span 1 / span 1;\"]");
                    this.floatTooltip(floatTarget, this.$refs.tooltipBody, "bottom");
                    break;

                case 3:
                    this.tooltipContent.paragraphs = [
                        "To the left you'll find a sidebar, which additionally displays these devices as a list."
                    ];

                    highlightedEl = document.querySelector("section.room-view");
                    highlightedEl.classList.remove("tutorial-element-highlight");

                    highlightedEl = document.querySelector("aside.sidebar");
                    highlightedEl.classList.add("tutorial-element-highlight");
                    this.floatTooltip(highlightedEl, this.$refs.tooltipBody, "right");
                    break;

                case 4:
                    this.tooltipContent.paragraphs = [
                        "Click around a bit to familiarize yourself with the UI 😊"
                    ];
                    this.tooltipContent.fixedCenter = true;

                    highlightedEl = document.querySelector("aside.sidebar");
                    highlightedEl.classList.remove("tutorial-element-highlight");
                    break;

                case 5:
                    this.tutorialStep = 0;
            }
        },

        floatTooltip(targetEl, currentTooltip, placement) {
            this.floatCleanup = autoUpdate(targetEl, currentTooltip, () => {
                computePosition(targetEl, currentTooltip, {
                    middleware: [
                        // https://github.com/floating-ui/floating-ui/issues/1769
                        offset(({rects}) => -rects.floating.height / 2)
                    ],
                    placement
                }).then(({x, y}) => {
                    Object.assign(currentTooltip.style, {
                        transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`
                    });
                });
            }, {
                elementResize: false
            });
        }
    },

    mounted() {
        this.prepareNextTooltip();
    }
};
</script>

<style>
.tutorial-element-highlight {
    box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4) !important;
    z-index: 5 !important;
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
    top: 0;
    left: 0;
}

.tooltip-fixed-center {
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
