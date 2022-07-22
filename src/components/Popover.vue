<template>
    <slot @click="console.log('nice')" ref="defaultSlot"></slot>
</template>

<script>
import { autoUpdate, computePosition, offset, shift, arrow, autoPlacement } from "@floating-ui/dom";
import { nextTick } from "vue";

export default {
    name: "Popover",

    methods: {
        showTooltip() {
            const buttonEl = document.querySelector("#tooltip-button");
            const tooltipEl = document.querySelector("#tooltip-body");
            const arrowEl = document.querySelector("#tooltip-arrow");

            if (tooltipEl.style.display === "block") {
                tooltipEl.style.display = "";
                this.tooltipCleanup();
                return;
            }
            tooltipEl.style.display = "block";

            this.tooltipCleanup = autoUpdate(buttonEl, tooltipEl, () => {
                    computePosition(buttonEl, tooltipEl, {
                        placement: "top",
                        middleware: [
                            offset(arrowEl.offsetHeight),
                            shift({padding: 5}),
                            arrow({element: arrowEl}),
                            autoPlacement({allowedPlacements: ["top", "bottom"]})
                        ]
                    }).then(({x, y, placement, middlewareData}) => {
                        Object.assign(tooltipEl.style, {
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

                        Object.assign(arrowEl.style, {
                            left: arrowX != null ? `${arrowX}px` : "",
                            top: arrowY != null ? `${arrowY}px` : "",
                            [oppositeSide]: `-${(arrowEl.offsetHeight / 2) + 1}px`
                        });
                    });
                },
                {
                    elementResize: false
                });
        }
    },

    async mounted() {
        await nextTick();
        console.log("d", this.$refs.defaultSlot);
    }
};
</script>

<style scoped></style>
