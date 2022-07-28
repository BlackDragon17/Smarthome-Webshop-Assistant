<template>
    <div class="page-indicator" ref="pageIndicator"></div>
</template>

<script>
import { autoUpdate, computePosition } from "@floating-ui/dom";

export default {
    name: "ActivePageIndicator",

    data() {
        return {
            targetElWidth: "0px",
            firstDisplay: true,
            indicatorCleanup: null
        };
    },

    props: {
        targetEl: HTMLElement
    },

    methods: {
        showIndicator() {
            // If this isn't the indicator's first appearance, we let it animate the transition to new target
            // and then disable animation, to make it visually stick to its target.
            if (!this.firstDisplay) {
                this.indicatorCleanup();
                this.$refs.pageIndicator.style.transition = "var(--indicatorTransition)";
                setTimeout(() => this.$refs.pageIndicator.style.transition = "", 260);
            }

            this.indicatorCleanup = autoUpdate(this.targetEl, this.$refs.pageIndicator, () => {
                    computePosition(this.targetEl, this.$refs.pageIndicator, {
                        placement: "bottom"
                    }).then(({x}) => {
                        Object.assign(this.$refs.pageIndicator.style, {
                            transform: `translateX(${Math.round(x)}px)`
                        });
                    });
                },
                {
                    elementResize: false
                });

            if (this.firstDisplay) {
                this.firstDisplay = false;
                this.$refs.pageIndicator.style.display = "block";
            }
        }
    },

    watch: {
        // We need to set up the indicator width and autoUpdate anew upon target change
        targetEl() {
            this.targetElWidth = this.targetEl.offsetWidth + "px";
            this.showIndicator();
        }
    }
};
</script>

<style scoped>
.page-indicator {
    width: v-bind(targetElWidth);
    height: 0.27rem;

    border-radius: 10rem;
    background-color: var(--blue-logo);

    position: absolute;
    bottom: 0;
    display: none;

    --indicatorTransition: transform 0.25s;
}
</style>
