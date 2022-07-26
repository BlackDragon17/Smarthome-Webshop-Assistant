<template>
    <div>
        <div ref="popoverTarget" @click="showPopover">
            <slot></slot>
        </div>
        <Teleport :to="tpTarget ?? $root.activeViewRoot">
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
            required: false
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

            this.$refs.popoverBody.style.visibility = "visible";
            this.$refs.popoverBody.style.opacity = "1";
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
                        // Hide body when popover target moves off-screen (positive body offsets).
                        // Similarly to device overflow detection, we need a buffer where no rule applies to avoid flickering (here: the size of a scrollbar).
                        const bodyOffsets = middlewareData.hide.referenceHiddenOffsets;
                        if (bodyOffsets.top > 0 || bodyOffsets.right > 18 || bodyOffsets.bottom > 18 || bodyOffsets.left > 0) {
                            this.$refs.popoverBody.style.visibility = "hidden";
                            this.$refs.popoverBody.style.transform = "";
                            return;
                        } else if (bodyOffsets.right <= 0 && bodyOffsets.bottom <= 0) {
                            // We only need this buffer where scrollbars can appear: right & bottom
                            this.$refs.popoverBody.style.visibility = "visible";
                        }
                        if (this.$refs.popoverBody.style.visibility === "hidden") {
                            return;
                        }

                        // Position body
                        Object.assign(this.$refs.popoverBody.style, {
                            transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`
                        });

                        // Hide arrow if overflowing
                        const {x: arrowX, y: arrowY, centerOffset: arrowOffset} = middlewareData.arrow;
                        if (arrowOffset > 0) {
                            this.$refs.popoverArrow.style.visibility = "hidden";
                            return;
                        } else if (this.$refs.popoverArrow.style.visibility) {
                            this.$refs.popoverArrow.style.visibility = "";
                        }

                        // Position arrow
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

            this.$refs.popoverBody.style.opacity = "0";
            this.$refs.popoverBody.style.visibility = "hidden";
            this.popoverCleanup();
            this.$eventBus.$emit("popover-hidden");
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
        window.addEventListener("click", this.handleClick);
        this.$eventBus.$on("popover-hide", this.hidePopover);
    },

    beforeUnmount() {
        window.removeEventListener("click", this.handleClick);
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
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;

    transition: visibility 0.17s, opacity 0.17s;
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
