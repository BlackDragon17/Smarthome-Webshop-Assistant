class FilterRule {
    constructor() {
        // By default, all values of a given option are allowed.
        // If allowed is an array (incl. an empty one), everything except its values is disabled (incl. the all/any values).
        // For any-of options, these will only be pre-selected.
        this.allowed = "all";
        // All required values will be both disabled and pre-selected.
        // Used for all-of options and radios.
        this.required = [];
        // Allows pre-selecting values without disabling any.
        this.selected = [];
    }

    addAllowed(prop) {
        if (this.allowed === "all") {
            this.allowed = [prop];
        } else if (!this.allowed.includes(prop)) {
            this.allowed.push(prop);
        }
    }

    addRequired(prop) {
        if (!this.required.includes(prop)) {
            this.required.push(prop);
        }
    }
}

export default class FilterRules {
    constructor() {
        this.category = new FilterRule();
        this.type = new FilterRule();
        this.formFactor = new FilterRule();
        this.senses = new FilterRule();
        this.features = new FilterRule();
        this.networks = new FilterRule();
        this.brands = new FilterRule();
    }
}
