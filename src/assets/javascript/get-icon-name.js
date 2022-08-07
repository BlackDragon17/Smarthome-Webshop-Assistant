export default function(obj) {
    if (Array.isArray(obj)) {
        obj = obj[0];
    }
    switch (obj) {
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
