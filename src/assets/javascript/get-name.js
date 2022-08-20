import { capitalize } from "vue";

class GetName {
    camelCase2TitleCase(text) {
        return capitalize(text.replace(/([A-Z])/g, " $1"));
    }

    // Return category headings.
    categoryHeading(value) {
        switch (value) {
            case "hub":
            case "light":
            case "sensor":
                return capitalize(value) + "s";
            case "switch":
                return "Buttons & Switches";
        }
    }

    // Return the category of a singular product.
    categoryProduct(product) {
        const category = Array.isArray(product.category) ? product.category[0] : product.category;
        switch (category) {
            case "switch":
                return this.typeProduct(product);
            default:
                return capitalize(category);
        }
    }

    categoryIcon(category) {
        category = Array.isArray(category) ? category[0] : category;
        switch (category) {
            case "hub":
                return "hub";
            case "light":
                return "lightbulb";
            case "switch":
                return "switch";
            case "sensor":
                return "sensors";
        }
    }

    typeProduct(product) {
        return this.camelCase2TitleCase(product.type);
    }

    sense(value) {
        switch (value) {
            case "uv":
                return "Ultra-violet"
            default:
                return this.camelCase2TitleCase(value);
        }
    }

    network(value) {
        switch (value) {
            case "lan":
                return "Wi-Fi / Ethernet";
            case "thread":
                return "Thread";
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
            default:
                return capitalize(value);
        }
    }

    control(value) {
        switch (value) {
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
                return capitalize(value);
        }
    }
}

export default new GetName();
