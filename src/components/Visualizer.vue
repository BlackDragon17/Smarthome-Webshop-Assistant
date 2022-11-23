<template>
    <Teleport to="body">
        <div ref="background" class="background">
            <div class="device-grid">
                <div class="device" v-for="n in gridColumns * gridRows">
                    <span class="device-icon material-symbols-rounded">
                        {{ randomDeviceContent() }}
                    </span>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
export default {
    name: "Visualizer",

    data() {
        return {
            gridColumns: 1,
            gridRows: 1,
            remInPx: 16,
            resizeObserver: null
        };
    },

    methods: {
        randomDeviceContent() {
            const allCategories = Object.keys(this.$getName.allCategories);
            const randomInt = Math.floor(Math.random() * allCategories.length);
            return this.$getName.categoryIcon(allCategories[randomInt]);
        },

        setGridDimensions() {
            // 3rem width + 4px total margin + 4px buffer
            const deviceWidth = this.remInPx * 3 + 8;

            const viewWidth = this.$refs.background.offsetWidth;
            this.gridColumns = Math.floor(viewWidth / deviceWidth);

            const viewHeight = this.$refs.background.offsetHeight;
            this.gridRows = Math.floor(viewHeight / deviceWidth);
        }
    },

    mounted() {
        this.remInPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("font-size"));

        this.resizeObserver = new ResizeObserver(this.setGridDimensions);
        this.resizeObserver.observe(this.$refs.background);
    }
};
</script>

<style scoped>
.background {
    width: 100vw;
    height: 100vh;

    background-color: white;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
}

.device-grid {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: repeat(v-bind(gridColumns), 1fr);
}

.device {
    margin: 2px;
    padding: 0;
    width: 3rem;
    height: 3rem;

    border: none;
    border-radius: 0.2rem;
    background-color: var(--blue-rooms-devices);
    color: white;
    outline: none;

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: clip;
}

.device-icon {
    font-size: 1.7rem;
    font-variation-settings: "GRAD" 100;
}
</style>
