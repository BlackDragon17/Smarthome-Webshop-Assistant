<template>
    <div v-if="tooltipShown" ref="tooltipBody" class="tooltip-body" :class="{'tooltip-centered': !tooltipContent?.target}">
        <h5 class="tooltip-heading" v-if="tooltipContent.heading">
            {{ tooltipContent.heading }}
        </h5>
        <p class="tooltip-text" v-for="paragraph in tooltipContent.paragraphs">
            {{ paragraph }}
        </p>
        <button class="tooltip-button btn btn-success" @click="hideTooltip">Ok</button>
        <div v-if="tooltipContent.showArrow"
             ref="tooltipArrow"
             class="tooltip-arrow"
             :class="arrowSide ? 'arrow-border-' + arrowSide : ''">
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import { autoUpdate, computePosition, offset, arrow, autoPlacement } from "@floating-ui/dom";
import Events from "@/assets/javascript/events";

export default {
    name: "TutorialTooltip",

    data() {
        return {
            tooltipShown: false,
            tooltipContent: null,

            floatCleanup: null,
            arrowSide: ""
        };
    },

    methods: {
        /**
         * @param {TooltipContent} tooltipContent
         */
        async openTooltip(tooltipContent) {
            if (this.tooltipShown) {
                return;
            }

            this.tooltipContent = tooltipContent;
            this.tooltipShown = true;

            await nextTick();
            setTimeout(() => {
                this.$refs.tooltipBody.style.opacity = "1";
            }, 10);

            if (!this.tooltipContent.target) {
                return;
            }
            this.tooltipContent.target.addEventListener("click", this.hideTooltip);
            this.floatTooltip(this.$refs.tooltipBody, this.tooltipContent.target);
        },

        hideTooltip() {
            if (!this.tooltipShown) {
                return;
            }

            this.$refs.tooltipBody.style.opacity = "0";

            if (this.floatCleanup) {
                this.floatCleanup();
                this.floatCleanup = null;
            }

            if (this.tooltipContent.target) {
                this.tooltipContent.target.removeEventListener("click", this.hideTooltip);
            }

            setTimeout(() => {
                this.tooltipShown = false;
                this.tooltipContent = null;
            }, 200);
        },

        floatTooltip() {
            const middleware = [];

            if (this.tooltipContent.showArrow) {
                middleware.push(offset(this.$refs.tooltipArrow.offsetHeight / 1.4));
                middleware.push(arrow({element: this.$refs.tooltipArrow}));
            } else {
                middleware.push(offset(6));
            }

            if (this.tooltipContent.placement === "auto") {
                middleware.push(autoPlacement());
            }

            this.floatCleanup = autoUpdate(this.tooltipContent.target, this.$refs.tooltipBody, () => {
                computePosition(this.tooltipContent.target, this.$refs.tooltipBody, {
                    middleware,
                    placement: this.tooltipContent.placement === "auto" ? undefined : this.tooltipContent.placement
                }).then(({x, y, placement, middlewareData}) => {
                    Object.assign(this.$refs.tooltipBody.style, {
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
        this.$eventBus.$on(Events.SHOW_TOOLTIP, this.openTooltip);
        this.$eventBus.$on(Events.VIEW_CHANGED, this.hideTooltip);
    },

    beforeUnmount() {
        this.$eventBus.$off(Events.SHOW_TOOLTIP, this.openTooltip);
        this.$eventBus.$off(Events.VIEW_CHANGED, this.hideTooltip);
    }
};
</script>

<style scoped>
.tooltip-body {
    min-width: 15rem;
    max-width: 20rem;
    padding: 15px;

    border-radius: 0.5rem;
    background-color: var(--green-tooltip-bg);
    color: white;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--green-tooltip-border);

    z-index: 6;
    position: absolute;
    top: 0;
    left: 0;

    opacity: 0;
    transition: opacity 0.17s;
}

.tooltip-centered {
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
}


/* Tooltip content styling */

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

.tooltip-button {
    margin-top: 0.4rem;

    --bs-btn-bg: var(--green-devices-main-darker2);
    --bs-btn-hover-bg: var(--green-devices-main-darker3);
    --bs-btn-active-bg: var(--green-devices-main-darker4);
}


/* Tooltip arrow styling */

.tooltip-arrow {
    width: 20px;
    height: 20px;

    background-color: inherit;
    --tooltip-arrow-border: 1px solid var(--green-tooltip-border);

    position: absolute;
    transform: rotate(45deg);
}

.arrow-border-top {
    border-left: var(--tooltip-arrow-border);
    border-top: var(--tooltip-arrow-border);
}

.arrow-border-right {
    border-top: var(--tooltip-arrow-border);
    border-right: var(--tooltip-arrow-border);
}

.arrow-border-bottom {
    border-right: var(--tooltip-arrow-border);
    border-bottom: var(--tooltip-arrow-border);
}

.arrow-border-left {
    border-bottom: var(--tooltip-arrow-border);
    border-left: var(--tooltip-arrow-border);
}
</style>
