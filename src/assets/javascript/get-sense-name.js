import { capitalize } from "vue";

export default function(property) {
    switch (property) {
        case "uv":
            return "Ultra-violet"

        default:
            return capitalize(property);
    }
}
