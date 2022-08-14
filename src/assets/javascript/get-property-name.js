import { capitalize } from "vue";

export default function(property) {
    switch (property) {
        // Categories
        case "hub":
        case "light":
        case "sensor":
            return capitalize(property) + "s";
        case "switch":
            return "Buttons & Switches";

        // Networks
        case "wifi":
            return "Wi-Fi";
        case "ethernet":
            return "Ethernet";
        case "bluetooth":
            return "Bluetooth";
        case "zigbee":
            return "Zigbee";
        case "zWave":
            return "Z-Wave";
        case "thread":
            return "Thread";

        // Controls
        case "alexa":
            return "Alexa";
        case "googleAssistant":
            return "Google Assistant";
        case "homeKit":
            return "Apple HomeKit";
        case "smartThings":
            return "Samsung SmartThings";
        case "brandApp":
            return "Vendor app";

        default:
            return capitalize(property);
    }
}
