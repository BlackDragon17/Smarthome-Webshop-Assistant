<template>
    <div>
        <div ref="popoverTarget" @click="showPopover">
            <slot></slot>
        </div>
        <Teleport :to="tpTarget ?? $root.activeRootView">
            <div ref="popoverBody" class="popover-body">
                <div ref="popoverArrow" class="popover-arrow" :class="arrowSide ? 'arrow-border-' + arrowSide : ''"></div>
                <slot name="popover"></slot>
            </div>
        </Teleport>
    </div>
</template>

<script>
import { autoUpdate, computePosition, offset, shift, arrow, autoPlacement, hide } from "@floating-ui/dom";

export default {
    name: "Popover",

    /**
     * TODO:
     * - Flip arrow border as necessary - done
     * - Switch to translate-positioning
     * - Add fade-in/out
     * - Make popover hide itself when target goes offscreen - done
     */

    data() {
        return {
            popoverShown: false,
            toggleLock: false,

            popoverCleanup: null,
            arrowSide: ""
        };
    },

    props: {
        tpTarget: {
            required: false,
            default: null
        }
    },

    emits: ["popover-shown", "popover-hidden", "focus-home-setup"],

    methods: {
        handleClick(event) {
            if (!this.toggleLock && this.popoverShown
                && !(event.target === this.$refs.popoverBody || this.$refs.popoverBody.contains(event.target))) {
                this.hidePopover();
            }
        },

        showPopover() {
            if (this.toggleLock || this.popoverShown) {
                return;
            }
            this.toggleLock = true;
            this.popoverShown = true;

            this.$refs.popoverBody.style.display = "block";
            this.$eventBus.$emit("popover-shown");

            this.popoverCleanup = autoUpdate(this.$refs.popoverTarget, this.$refs.popoverBody, () => {
                    computePosition(this.$refs.popoverTarget, this.$refs.popoverBody, {
                        placement: "top",
                        middleware: [
                            offset(this.$refs.popoverArrow.offsetHeight / 2),
                            shift({padding: 5}),
                            arrow({element: this.$refs.popoverArrow, padding: 7}),
                            autoPlacement({allowedPlacements: ["top", "bottom"]}),
                            hide()
                        ]
                    }).then(({x, y, placement, middlewareData}) => {
                        // Hide body if overflowing
                        const {referenceHidden} = middlewareData.hide;
                        Object.assign(this.$refs.popoverBody.style, {
                            visibility: referenceHidden ? "hidden" : "visible"
                        });
                        if (referenceHidden) {
                            return;
                        }

                        // Position body
                        Object.assign(this.$refs.popoverBody.style, {
                            left: `${x}px`,
                            top: `${y}px`
                        });

                        // Hide arrow if overflowing
                        if (middlewareData.arrow.centerOffset > 1) {
                            this.$refs.popoverArrow.style.display = "none";
                            return;
                        } else if (this.$refs.popoverArrow.style.display) {
                            this.$refs.popoverArrow.style.display = "";
                        }

                        // Position arrow
                        const {x: arrowX, y: arrowY} = middlewareData.arrow;
                        const oppositeSide = {
                            top: "bottom",
                            right: "left",
                            bottom: "top",
                            left: "right"
                        }[placement.split("-")[0]];
                        this.arrowSide = oppositeSide;

                        Object.assign(this.$refs.popoverArrow.style, {
                            left: arrowX != null ? `${arrowX}px` : "",
                            top: arrowY != null ? `${arrowY}px` : "",
                            [oppositeSide]: `-${(this.$refs.popoverArrow.offsetHeight / 2) + 0.5}px`
                        });
                    });
                },
                {
                    elementResize: false
                });

            this.$eventBus.$emit("focus-home-setup");
        },

        hidePopover() {
            if (this.toggleLock || !this.popoverShown) {
                return;
            }
            this.toggleLock = true;
            this.popoverShown = false;
            this.arrowSide = "";

            this.$refs.popoverBody.style.display = "";
            this.$eventBus.$emit("popover-hidden");
            this.popoverCleanup();
        }
    },

    watch: {
        toggleLock(newValue) {
            if (newValue) {
                setTimeout(() => this.toggleLock = false, 200);
            }
        }
    },

    mounted() {
        window.addEventListener("click", this.handleClick, true);
        this.$eventBus.$on("popover-hide", this.hidePopover);
    },

    beforeUnmount() {
        window.removeEventListener("click", this.handleClick, true);
        if (this.popoverCleanup) {
            this.popoverCleanup();
        }
        this.$eventBus.$off("popover-hide", this.hidePopover);
    }
};
</script>

<style scoped>
.popover-body {
    margin: 0;
    max-height: 50vh;
    /* overflow: auto; */

    border: 1px solid lightgray;
    border-radius: 0.5rem;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    background-color: white;
    color: #222;

    z-index: 2;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}

/* Make the popover content appear above the arrow */
.popover-body > :nth-child(2) {
    position: relative;
}

.popover-arrow {
    width: 10px;
    height: 10px;

    --popover-arrow-border: 1px solid lightgray;
    background-color: inherit;

    position: absolute;
    transform: rotate(45deg);
}

.arrow-border-top {
    border-top: var(--popover-arrow-border);
    border-left: var(--popover-arrow-border);
}

.arrow-border-bottom {
    border-right: var(--popover-arrow-border);
    border-bottom: var(--popover-arrow-border);
}
</style>
