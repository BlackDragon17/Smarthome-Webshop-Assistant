/**
 * The DTO representing the values of the Product Database sidebar filter values.
 */
export default class FilterValues {
    /**
     * Creates a new instance of {@link FilterValues}.
     * It is possible to pass an existing instance of {@link FilterValues}, in which case all non-null values will be copied over.
     *
     * @param {FilterValues} [filterValuesBase] an existing (partial) instance of FilterValues.
     */
    constructor(filterValuesBase) {
        this.category = filterValuesBase?.category ?? "all";
        this.type = filterValuesBase?.type ?? "any";
        this.formFactor = filterValuesBase?.formFactor ?? "any";
        this.anySense = filterValuesBase?.anySense ?? true;
        this.senses = filterValuesBase?.senses ?? [];
        this.features = filterValuesBase?.features ?? [];
        this.anyNetwork = filterValuesBase?.anyNetwork ?? true;
        this.networks = filterValuesBase?.networks ?? [];
        this.anyBrand = filterValuesBase?.anyBrand ?? true;
        this.brands = filterValuesBase?.brands ?? [];
    }

    /**
     * Resets the given FilterValues properties to their default values on this object.
     *
     * @param {string} props names of properties to reset, given as strings.
     */
    resetProperties(...props) {
        const defaultValues = new FilterValues();
        for (const prop of props) {
            if (typeof prop !== "string" || defaultValues[prop] == null) {
                continue;
            }
            this[prop] = defaultValues[prop];
        }
    }

    /**
     * Resets all properties on this object to their default values, except for any specified exceptions.
     *
     * @param {string} [exceptions] string names of properties to not reset.
     */
    resetAllProperties(...exceptions) {
        const defaultValues = new FilterValues();
        for (const prop of Object.keys(defaultValues)) {
            if (exceptions.includes(prop)) {
                continue;
            }
            this[prop] = defaultValues[prop];
        }
    }
}
