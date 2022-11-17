<template>
    <button class="device-card" @click="openDeviceInfoModal">
        <span class="device-icon material-symbols-rounded">
            {{ $getName.categoryIcon(product.category) }}
        </span>
        <span class="device-text">
            <span class="device-name">{{ product.brand }} {{ product.model }}</span>
            <span class="device-location">
                <span class="emphasized-text">{{ $getName.categoryHeadingSingular(product.category) }}</span>
                in the
                <span class="emphasized-text">{{ device.room.toLowerCase() }}</span>
            </span>
        </span>
    </button>
</template>

<script>
import Device from "@/assets/javascript/dto/device";
import Events from "@/assets/javascript/events";

export default {
    name: "DeviceCard",

    props: {
        device: {
            type: Device,
            required: true
        },
        product: {
            type: Object,
            required: true
        }
    },

    emits: [Events.OPEN_DEVICE_INFO],

    methods: {
        openDeviceInfoModal() {
            this.$eventBus.$emit(Events.OPEN_DEVICE_INFO, this.device);
        }
    }
};
</script>

<style scoped>
.emphasized-text {
    font-style: italic;
}

.device-card {
    margin: 0.6rem 0;
    padding: 0.5rem;
    width: 100%;
    min-height: 5.5rem;

    border: 1px solid lightgray;
    border-radius: var(--button-border-radius);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    background-color: white;

    display: flex;
    flex-direction: row;
}

.device-card:hover, .device-card:focus {
    background-color: #EEE;
}

.device-card:active {
    background-color: #DDD;
}

.device-icon {
    padding: 0 0.4rem;

    font-size: 2rem;
    font-weight: 350;
    font-variation-settings: "GRAD" -200;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.device-text {
    padding-left: 0.4rem;
    text-align: left;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.device-name {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

.device-location {
    padding-left: 1px;
    font-size: 0.95em;
    display: block;
}
</style>
