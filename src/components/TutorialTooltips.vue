<template>
    <div v-if="displayTooltip" class="tutorial-curtain" :class="{'curtain-dark-bg': tooltipContent.fixedCenter}">
        <div ref="tooltipBody" class="tutorial-tooltip" :class="{'tooltip-fixed-center': tooltipContent.fixedCenter}">
            <h5 class="tooltip-heading" v-if="tooltipContent.heading">
                {{ tooltipContent.heading }}
            </h5>
            <p class="tooltip-text" v-for="parahraph in tooltipContent.paragraphs">
                {{ parahraph }}
            </p>
            <div class="tooltip-footer">
                <button class="tooltip-button btn btn-success" @click="nextTooltip">Next</button>
                <span class="tooltip-counter">{{ tooltipStep }} / {{ tooltipTotalSteps }}</span>
                <div ref="tooltipArrow" v-if="tooltipContent.showArrow" class="tooltip-arrow"></div>
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
            tooltipContent: {heading: null, paragraphs: [], fixedCenter: false, showArrow: false},

            tutorialStepHomeSetup: 0,
            homeSetupTotalSteps: 4,
            tutorialStepProductDatabase: 0,
            productDatabaseTotalSteps: 2,

            currentFocustrap: null,
            floatCleanup: null
        };
    },

    props: {
        activeView: String
    },

    computed: {
        /**
         * @returns {boolean}
         */
        displayTooltip() {
            switch (this.activeView) {
                case "HomeSetup":
                    return this.tutorialStepHomeSetup > 0 && this.tutorialStepHomeSetup <= this.homeSetupTotalSteps;
                case "ProductDatabase":
                    return this.tutorialStepProductDatabase > 0 && this.tutorialStepProductDatabase <= this.productDatabaseTotalSteps;
                default:
                    return false;
            }
        },

        /**
         * @returns {number}
         */
        tooltipStep() {
            switch (this.activeView) {
                case "HomeSetup":
                    return this.tutorialStepHomeSetup;
                case "ProductDatabase":
                    return this.tutorialStepProductDatabase;
            }
        },
        /**
         * @returns {number}
         */
        tooltipTotalSteps() {
            switch (this.activeView) {
                case "HomeSetup":
                    return this.homeSetupTotalSteps;
                case "ProductDatabase":
                    return this.productDatabaseTotalSteps;
            }
        }
    },

    methods: {
        async nextTooltip() {
            this.tooltipContent = {heading: null, paragraphs: [], fixedCenter: false, showArrow: false};
            if (this.floatCleanup) {
                this.floatCleanup();
                this.floatCleanup = null;
            }
            if (this.$refs.tooltipBody) {
                this.$refs.tooltipBody.style.transform = "";
            }

            if (this.activeView === "HomeSetup") {
                this.nextTooltipHomeSetup();
            } else if (this.activeView === "ProductDatabase") {
                this.nextTooltipProductDatabase();
            }
        },

        async nextTooltipHomeSetup() {
            if (this.tutorialStepHomeSetup > this.homeSetupTotalSteps) {
                return;
            }

            this.tutorialStepHomeSetup++;
            await nextTick();

            let highlightedEl = null;
            switch (this.tutorialStepHomeSetup) {
                case 1:
                    this.currentFocustrap = new FocusTrap({trapElement: this.$refs.tooltipBody});
                    this.currentFocustrap.activate();

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
                    this.floatTooltip(floatTarget, this.$refs.tooltipBody, "bottom", true);
                    break;

                case 3:
                    this.tooltipContent.paragraphs = [
                        "To the left you'll find a sidebar, which additionally displays these devices as a list."
                    ];
                    this.tooltipContent.showArrow = true;

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
                    this.currentFocustrap.deactivate();
                    break;
            }
        },

        async nextTooltipProductDatabase() {
            if (this.tutorialStepProductDatabase > this.productDatabaseTotalSteps) {
                return;
            }

            this.tutorialStepProductDatabase++;
            await nextTick();

            let highlightedEl = null;
            switch (this.tutorialStepProductDatabase) {
                case 1:
                    this.currentFocustrap = new FocusTrap({trapElement: this.$refs.tooltipBody});
                    this.currentFocustrap.activate();

                    this.tooltipContent = {
                        heading: "Product Database view",
                        paragraphs: ["This page of the app is used to find new devices for your setup."],
                        fixedCenter: true
                    };
                    break;

                case 2:
                    this.tooltipContent.paragraphs = [
                        "The sidebar lets you filter products to find what you need.",
                        "Some filter are pre-applied to only show compatible products."
                    ];
                    this.tooltipContent.showArrow = true;

                    highlightedEl = document.querySelector("aside.sidebar");
                    highlightedEl.classList.add("tutorial-element-highlight");
                    this.floatTooltip(highlightedEl, this.$refs.tooltipBody, "right");
                    break;

                case 3:
                    this.currentFocustrap.deactivate();
                    highlightedEl = document.querySelector("aside.sidebar");
                    highlightedEl.classList.remove("tutorial-element-highlight");
                    break;
            }
        },

        async floatTooltip(targetEl, currentTooltip, placement, doOffset = false) {
            const middleware = [];

            if (doOffset) {
                middleware.push(offset(({rects}) => -rects.floating.height / 2));
            } else if (this.tooltipContent.showArrow) {
                await nextTick();
                middleware.push(offset(this.$refs.tooltipArrow.offsetHeight / 1.4));
                middleware.push(arrow({element: this.$refs.tooltipArrow}));
            }

            this.floatCleanup = autoUpdate(targetEl, currentTooltip, () => {
                computePosition(targetEl, currentTooltip, {
                    middleware,
                    placement
                }).then(({x, y, placement, middlewareData}) => {
                    Object.assign(currentTooltip.style, {
                        transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`
                    });

                    if (!this.tooltipContent.showArrow) {
                        return;
                    }

                    // Position arrow
                    const oppositeSide = {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right"
                    }[placement.split("-")[0]];
                    this.arrowSide = oppositeSide;

                    const {x: arrowX, y: arrowY} = middlewareData.arrow;
                    Object.assign(this.$refs.tooltipArrow.style, {
                        left: arrowX != null ? `${arrowX}px` : "",
                        top: arrowY != null ? `${arrowY}px` : "",
                        [oppositeSide]: `-${(this.$refs.tooltipArrow.offsetHeight / 2) + 0.5}px`
                    });
                });
            }, {
                elementResize: false
            });
        }
    },

    mounted() {
        this.$eventBus.$on("view-changed", this.nextTooltip);

        this.nextTooltip();
    },

    beforeUnmount() {
        this.$eventBus.$off("view-changed", this.nextTooltip);
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


.tooltip-arrow {
    width: 20px;
    height: 20px;

    background-color: var(--green-tooltip-bg);

    position: absolute;
    transform: rotate(45deg);
}
</style>
