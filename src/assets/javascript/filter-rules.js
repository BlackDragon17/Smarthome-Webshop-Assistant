class FilterRule {
    constructor() {
        this.allowed = "all";
        this.required = [];
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
            this.addAllowed(prop);
        }
    }
}

export default class FilterRules {
    constructor() {
        this.category = new FilterRule();
        this.type = new FilterRule();
        this.formFactor = new FilterRule();
        this.features = new FilterRule();
        this.brands = new FilterRule();
        this.networks = new FilterRule();
    }
}
