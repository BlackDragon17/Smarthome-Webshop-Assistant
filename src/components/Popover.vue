<template>
    <div>
        <div @click="togglePopover" ref="popoverTarget">
            <slot></slot>
        </div>
        <Teleport :to="this.$root.activeRootView">
            <div class="popover-body" ref="popoverBody">
                <div class="popover-arrow" ref="popoverArrow"></div>
                <slot name="popover"></slot>
            </div>
        </Teleport>
    </div>
</template>

<script>
import { autoUpdate, computePosition, offset, shift, arrow, autoPlacement } from "@floating-ui/dom";

export default {
    name: "Popover",

    data() {
        return {
            popoverShown: false,
            toggleLock: false,
            popoverCleanup: null
        };
    },

    methods: {
        test() {
        },

        togglePopover() {
            if(!this.popoverShown) {
                this.showPopover();
            }
        },
        handleClick(event) {
            if (this.popoverShown
                && !(event.target === this.$refs.popoverBody || this.$refs.popoverBody.contains(event.target))) {
                this.hidePopover();
            }
        },

        showPopover() {
            if (this.toggleLock) {
                return;
            }
            this.toggleLock = true;
            this.popoverShown = true;

            this.$refs.popoverBody.style.display = "block";

            this.popoverCleanup = autoUpdate(this.$refs.popoverTarget, this.$refs.popoverBody, () => {
                    computePosition(this.$refs.popoverTarget, this.$refs.popoverBody, {
                        placement: "top",
                        middleware: [
                            offset(this.$refs.popoverArrow.offsetHeight / 2),
                            shift({padding: 5}),
                            arrow({element: this.$refs.popoverArrow}),
                            autoPlacement({allowedPlacements: ["top", "bottom"]})
                        ]
                    }).then(({x, y, placement, middlewareData}) => {
                        Object.assign(this.$refs.popoverBody.style, {
                            left: `${x}px`,
                            top: `${y}px`
                        });

                        const {x: arrowX, y: arrowY} = middlewareData.arrow;

                        const oppositeSide = {
                            top: "bottom",
                            right: "left",
                            bottom: "top",
                            left: "right"
                        }[placement.split("-")[0]];

                        Object.assign(this.$refs.popoverArrow.style, {
                            left: arrowX != null ? `${arrowX}px` : "",
                            top: arrowY != null ? `${arrowY}px` : "",
                            [oppositeSide]: `-${(this.$refs.popoverArrow.offsetHeight / 2) + 1}px`
                        });
                    });
                },
                {
                    elementResize: false
                });
        },
        hidePopover() {
            if (this.toggleLock) {
                return;
            }
            this.toggleLock = true;
            this.popoverShown = false;

            this.$refs.popoverBody.style.display = "";
            this.popoverCleanup();
        }
    },

    watch: {
        toggleLock(newValue) {
            if(newValue) {
                setTimeout(() => this.toggleLock = false, 200);
            }
        }
    },

    mounted() {
        window.addEventListener("click", this.handleClick, true);
    },

    beforeUnmount() {
        window.removeEventListener("click", this.handleClick, true);
        if (this.popoverCleanup) {
            this.popoverCleanup();
        }
    }
};
</script>

<style scoped>
.popover-body {
    margin: 0;

    border: 1px solid lightgray;
    border-radius: 0.5rem;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
    background-color: white;
    color: #222;

    z-index: 2;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}

/* Make the popover body appear above the arrow */
.popover-body > :nth-child(2) {
    position: relative;
}

.popover-arrow {
    width: 10px;
    height: 10px;

    border-right: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    background-color: inherit;

    position: absolute;
    transform: rotate(45deg);
}
</style>
