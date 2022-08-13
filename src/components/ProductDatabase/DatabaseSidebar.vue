<template>
    <aside class="sidebar">
        <h3 class="sidebar-heading">Filter products</h3>
        <div class="compatibility-switch form-check form-switch">
            <input type="checkbox"
                   role="switch"
                   id="compatibility-switch"
                   class="filter-input form-check-input"
                   name="compatibility"
                   v-model="compatFiltersEnabled"
                   :disabled="replaceId"
                   @change="$emit('compat-filters-toggled', compatFiltersEnabled)">
            <label for="compatibility-switch" class="filter-label form-check-label">Compatibility filters</label>
        </div>
        <hr>
        <div class="filter-list">
            <div class="filter-group" @change="categoryChanged">
                <h4 class="filter-group-heading">Category</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-all"
                           class="filter-input form-check-input"
                           name="category"
                           value="all"
                           v-model="filterValues.category"
                           :disabled="activeFilterRules.category.allowed !== 'all' || activeFilterRules.category.required.length > 0">
                    <label for="filter-category-radio-all" class="filter-label form-check-label">All</label>
                </div>
                <div class="form-check" v-for="(category, index) in optionsAllValues.allCategories" :key="category">
                    <input type="radio"
                           :id="`filter-category-radio-${index}`"
                           class="filter-input form-check-input"
                           name="category"
                           :value="category"
                           v-model="filterValues.category"
                           :disabled="checkDisabled('category', category)">
                    <label :for="`filter-category-radio-${index}`" class="filter-label form-check-label">{{ getPropertyName(category) }}</label>
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filterValues.category !== 'all'" @change="typeChanged">
                <h4 class="filter-group-heading">Type of {{ filterValues.category }}</h4>
                <div v-if="filterValues.category === 'hub'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="open"
                               v-model="filterValues.type">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Open</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="proprietary"
                               v-model="filterValues.type">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Proprietary</label>
                    </div>
                </div>

                <div v-else-if="filterValues.category === 'light'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="lamp"
                               v-model="filterValues.type">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Lamp</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="bulb"
                               v-model="filterValues.type">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Bulb</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-3"
                               class="filter-input form-check-input"
                               name="type"
                               value="lightStrip"
                               v-model="filterValues.type">
                        <label for="filter-type-radio-3" class="filter-label form-check-label">Light strip</label>
                    </div>
                </div>

                <div v-else-if="filterValues.category === 'sensor'">
                    Placeholder
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filterValues.type === 'bulb'">
                <h4 class="filter-group-heading">Form factor</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-1"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e14"
                           v-model="filterValues.formFactor">
                    <label for="filter-form-factor-radio-1" class="filter-label form-check-label">E14</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-2"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e27"
                           v-model="filterValues.formFactor">
                    <label for="filter-form-factor-radio-2" class="filter-label form-check-label">E27</label>
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filterValues.category === 'light'">
                <h4 class="filter-group-heading">Features</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-1"
                           class="filter-input form-check-input"
                           value="varLumen"
                           v-model="filterValues.features">
                    <label for="filter-feature-checkbox-1" class="filter-label form-check-label">Adjustable brightness</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-2"
                           class="filter-input form-check-input"
                           value="varKelvin"
                           v-model="filterValues.features">
                    <label for="filter-feature-checkbox-2" class="filter-label form-check-label">Adjustable color temperature</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-3"
                           class="filter-input form-check-input"
                           value="multicolor"
                           v-model="filterValues.features">
                    <label for="filter-feature-checkbox-3" class="filter-label form-check-label">Adjustable light color (RGB)</label>
                </div>
                <hr>
            </div>

            <div class="filter-group">
                <h4 class="filter-group-heading">Connectivity <small>({{ filterValues.category === "hub" ? "all" : "any" }} of:)</small></h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-any"
                           class="filter-input form-check-input"
                           v-model="filterValues.anyNetwork"
                           :disabled="activeFilterRules.networks.allowed !== 'all' || activeFilterRules.networks.required.length > 0"
                           @change="checkboxAnyNetwork">
                    <label for="filter-network-checkbox-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-1"
                           class="filter-input form-check-input"
                           value="thread"
                           v-model="filterValues.networks"
                           :disabled="checkDisabled('networks', 'thread')"
                           @change="checkboxNetwork">
                    <label for="filter-network-checkbox-1" class="filter-label form-check-label">Thread</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-2"
                           class="filter-input form-check-input"
                           value="wifi"
                           v-model="filterValues.networks"
                           :disabled="checkDisabled('networks', 'wifi')"
                           @change="checkboxNetwork">
                    <label for="filter-network-checkbox-2" class="filter-label form-check-label">Wi-Fi</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-3"
                           class="filter-input form-check-input"
                           value="bluetooth"
                           v-model="filterValues.networks"
                           :disabled="checkDisabled('networks', 'bluetooth')"
                           @change="checkboxNetwork">
                    <label for="filter-network-checkbox-3" class="filter-label form-check-label">Bluetooth</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-4"
                           class="filter-input form-check-input"
                           value="zigbee"
                           v-model="filterValues.networks"
                           :disabled="checkDisabled('networks', 'zigbee')"
                           @change="checkboxNetwork">
                    <label for="filter-network-checkbox-4" class="filter-label form-check-label">Zigbee</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-5"
                           class="filter-input form-check-input"
                           value="zWave"
                           v-model="filterValues.networks"
                           :disabled="checkDisabled('networks', 'zWave')"
                           @change="checkboxNetwork">
                    <label for="filter-network-checkbox-5" class="filter-label form-check-label">Z-Wave</label>
                </div>
                <hr>
            </div>

            <div class="filter-group">
                <h4 class="filter-group-heading">Brand</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-brand-checkbox-any"
                           class="filter-input form-check-input"
                           v-model="filterValues.anyBrand"
                           @change="checkboxAnyBrand">
                    <label for="filter-brand-checkbox-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check" v-for="(brand, index) in optionsAllValues.allBrands" :key="brand">
                    <input type="checkbox"
                           :id="`filter-brand-checkbox-${index}`"
                           class="filter-input form-check-input"
                           :value="brand"
                           v-model="filterValues.brands"
                           @change="checkboxBrand">
                    <label :for="`filter-brand-checkbox-${index}`" class="filter-label form-check-label">{{ brand }}</label>
                </div>
                <hr>
            </div>
        </div>
    </aside>
</template>

<script>
import FilterRules from "../../assets/javascript/filter-rules";

export default {
    name: "DatabaseSidebar",

    data() {
        return {
            compatFiltersEnabled: true
        };
    },

    props: {
        filterValues: Object,
        filterRules: Object,
        optionsAllValues: Object,

        replaceId: String,
    },

    emits: ["compat-filters-toggled"],

    computed: {
        activeFilterRules() {
            return this.compatFiltersEnabled ? this.filterRules : new FilterRules();
        },

        filterListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        // Checkbox callbacks

        // Reset dependant filterValues on selection change
        categoryChanged() {
            this.filterValues.type = "";
            this.filterValues.formFactor = "";
            this.filterValues.features = [];
        },
        typeChanged() {
            this.filterValues.formFactor = "";
        },


        // Logic for toggling "Any" checkbox options
        // Brands
        checkboxAnyBrand() {
            this.filterValues.anyBrand = true;
            this.filterValues.brands = [];
        },
        checkboxBrand() {
            this.filterValues.anyBrand = this.filterValues.brands.length <= 0;
        },
        // Networks
        checkboxAnyNetwork() {
            this.filterValues.anyNetwork = true;
            this.filterValues.networks = [];
        },
        checkboxNetwork() {
            this.filterValues.anyNetwork = this.filterValues.networks.length <= 0;
        },

        checkDisabled(property, value) {
            return (this.activeFilterRules[property].allowed !== 'all' && !this.activeFilterRules[property].allowed.includes(value))
                || this.activeFilterRules[property].required.includes(value);
        }
    }
};
</script>

<style scoped>
/* Sidebar styles */

.sidebar {
    width: 320px;
    height: 100%;
    padding: 0.5rem;
    background-color: #F8F8F8;

    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
}

.sidebar > * {
    /* border: 1px solid darkcyan; */
    display: block;
    width: 100%;
    margin: 0.7rem 0;
}



/* Sidebar content styles */

.sidebar-heading {
    font-size: 1.4rem;
    margin: 0.3rem 0;
}

.compatibility-switch {
    margin: 0.5rem 0 0.1rem;
}

.filter-list {
    /* Override horizontal sidebar padding to fix input shadow clipping */
    margin: 0 -0.3rem 0.7rem -0.5rem;
    padding-left: 0.6rem;
    padding-right: 0.7rem;
    width: calc(100% + 0.8rem);

    border: v-bind(filterListBorder);
    overflow-y: auto;
}

.filter-group-heading {
    font-size: 1.2rem;
}

.filter-input:not(:disabled):hover, .filter-input:not(:disabled):focus {
    border: 1px solid var(--blue-logo);
}

.filter-input:not(:disabled):hover + .filter-label,
.filter-input:not(:disabled):focus + .filter-label {
    color: var(--blue-room-text);
}
</style>
