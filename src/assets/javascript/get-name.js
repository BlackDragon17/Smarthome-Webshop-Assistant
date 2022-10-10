import { capitalize } from "vue";

class GetName {
    boolean2YesNo(value) {
        return value ? "Yes" : "No";
    }

    camelCase2TitleText(text) {
        if (!text) {
            return "";
        }
        return capitalize(text.replace(/([A-Z])/g, " $1"));
    }

    camelCase2Text(text) {
        if (!text) {
            return "";
        }
        return capitalize(text.replace(/([A-Z])/g, match => " " + match.toLowerCase()));
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
            default:
                return "Products";
        }
    }

    categoryHeadingSingular(value) {
        switch (value) {
            case "hub":
            case "light":
            case "sensor":
                return capitalize(value);
            case "switch":
                return "Button / Switch";
            default:
                return "Product";
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

    sense(value) {
        switch (value) {
            case "uv":
                return "Ultra-violet";
            default:
                return this.camelCase2Text(value);
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

    powerSource(value) {
        switch (value) {
            case "wall":
                return "Wall power";
            case "battery":
                return "Batteries";
            case "self":
                return "Self-generated";
        }
    }

    compatScore(score) {
        switch (score) {
            case 6:
                return "Required";
            case 5:
                return "Great";
            case 4:
                return "Good";
            case 3:
                return "Fair";
            case 2:
                return "Indirect";
            case 1:
                return "Incompatible";
            default:
                return "Undetermined";
        }
    }
}

export default new GetName();
