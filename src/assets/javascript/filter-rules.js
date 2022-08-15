class FilterRule {
    constructor(networkRule) {
        // By default, all values of a given option are allowed.
        // If allowed is an array (incl. an empty one), everything except its values is disabled (incl. the all/any values!).
        // Used for any-of options. The allowed values will be pre-selected.
        this.allowed = "all";
        // Used for all-of options and radios. The required values will be disabled and pre-selected.
        // For radios, all other options are also disabled, for all-of checkbox groups, they will not.
        this.required = [];
        // See explanation in createFilterValues().
        if (networkRule) {
            this.hubNetworks = [];
        }
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

    addHubNetwork(prop) {
        if (this.hubNetworks && !this.hubNetworks.includes(prop)) {
            this.hubNetworks.push(prop);
        }
    }

    removeHubNetwork(prop) {
        const index = this.hubNetworks?.findIndex(item => item === prop);
        if (index > -1) this.hubNetworks.splice(index, 1);
    }
}

export default class FilterRules {
    constructor() {
        this.category = new FilterRule(false);
        this.type = new FilterRule(false);
        this.formFactor = new FilterRule(false);
        this.senses = new FilterRule(false);
        this.features = new FilterRule(false);
        this.networks = new FilterRule(true);
        this.brands = new FilterRule(false);
    }
}
