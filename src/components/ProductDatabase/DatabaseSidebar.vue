<template>
    <aside class="sidebar">
        <button v-if="replaceId" class="cancel-replace-button btn btn-danger" @click="cancelReplacement">Cancel replacement</button>

        <h3 class="sidebar-heading">Filter products</h3>
        <div class="compatibility-switch form-check form-switch">
            <input type="checkbox"
                   role="switch"
                   id="compatibility-switch"
                   class="filter-input form-check-input"
                   name="compatibility"
                   v-model="compatFiltersControl.value"
                   :disabled="compatFiltersControl.disabled">
            <label for="compatibility-switch" class="filter-label form-check-label">Compatibility filters</label>
        </div>
        <hr>

        <div class="filter-list">
            <!-- Category -->
            <div class="filter-group" @change="categoryChanged">
                <h4 class="filter-group-heading">Category</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-all"
                           class="filter-input form-check-input"
                           name="category"
                           value="all"
                           v-model="filterValues.category"
                           :disabled="isOptionAnyDisabled('category')">
                    <label for="filter-category-radio-all" class="filter-label form-check-label">All</label>
                </div>
                <div class="form-check" v-for="(category, index) in optionsAllValues.allCategories" :key="category">
                    <input type="radio"
                           :id="`filter-category-radio-${index}`"
                           class="filter-input form-check-input"
                           name="category"
                           :value="category"
                           v-model="filterValues.category"
                           :disabled="isOptionDisabled('category', category)">
                    <label :for="`filter-category-radio-${index}`" class="filter-label form-check-label">
                        {{ $getName.categoryHeading(category) }}
                    </label>
                </div>
                <hr>
            </div>

            <!-- Type -->
            <div class="filter-group" v-if="['hub', 'light', 'switch'].includes(filterValues.category)" @change="typeChanged">
                <h4 class="filter-group-heading">Type of {{ filterValues.category }}</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-type-radio-any"
                           class="filter-input form-check-input"
                           name="type"
                           value="any"
                           v-model="filterValues.type"
                           :disabled="isOptionAnyDisabled('type')">
                    <label for="filter-type-radio-any" class="filter-label form-check-label">Any</label>
                </div>

                <div v-if="filterValues.category === 'hub'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="open"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'open')">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Open</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="proprietary"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'proprietary')">
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
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'lamp')">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Lamp</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="bulb"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'bulb')">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Bulb</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-3"
                               class="filter-input form-check-input"
                               name="type"
                               value="lightStrip"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'lightStrip')">
                        <label for="filter-type-radio-3" class="filter-label form-check-label">Light strip</label>
                    </div>
                </div>

                <div v-if="filterValues.category === 'switch'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="button"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'button')">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Button</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="dial"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'dial')">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Dial</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-3"
                               class="filter-input form-check-input"
                               name="type"
                               value="switch"
                               v-model="filterValues.type"
                               :disabled="isOptionDisabled('type', 'switch')">
                        <label for="filter-type-radio-3" class="filter-label form-check-label">Switch</label>
                    </div>
                </div>
                <hr>
            </div>

            <!-- Form factor -->
            <div class="filter-group" v-if="filterValues.type === 'bulb'">
                <h4 class="filter-group-heading">Form factor</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-any"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="any"
                           v-model="filterValues.formFactor"
                           :disabled="isOptionAnyDisabled('formFactor')">
                    <label for="filter-form-factor-radio-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-1"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e14"
                           v-model="filterValues.formFactor"
                           :disabled="isOptionDisabled('formFactor', 'e14')">
                    <label for="filter-form-factor-radio-1" class="filter-label form-check-label">E14</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-2"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e27"
                           v-model="filterValues.formFactor"
                           :disabled="isOptionDisabled('formFactor', 'e27')">
                    <label for="filter-form-factor-radio-2" class="filter-label form-check-label">E27</label>
                </div>
                <hr>
            </div>

            <!-- Senses -->
            <div class="filter-group" v-if="filterValues.category === 'sensor'">
                <h4 class="filter-group-heading">Senses <small>(all of:)</small></h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-sense-checkbox-any"
                           class="filter-input form-check-input"
                           v-model="filterValues.anySense"
                           :disabled="isOptionAnyDisabled('senses')"
                           @change="switchAnyOptionAny('senses')">
                    <label for="filter-sense-checkbox-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check" v-for="(sense, index) in optionsAllValues.allSenses" :key="sense">
                    <input type="checkbox"
                           :id="`filter-sense-checkbox-${index}`"
                           class="filter-input form-check-input"
                           :value="sense"
                           v-model="filterValues.senses"
                           :disabled="isOptionDisabled('senses', sense)"
                           @change="switchAnyOption('senses', sense)">
                    <label :for="`filter-sense-checkbox-${index}`" class="filter-label form-check-label">{{ $getName.sense(sense) }}</label>
                </div>
                <hr>
            </div>

            <!-- Features -->
            <div class="filter-group" v-if="filterValues.category === 'light'">
                <h4 class="filter-group-heading">Features <small>(all of:)</small></h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-1"
                           class="filter-input form-check-input"
                           value="varLumen"
                           v-model="filterValues.features"
                           :disabled="isOptionDisabled('features', 'varLumen')">
                    <label for="filter-feature-checkbox-1" class="filter-label form-check-label">Adjustable brightness</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-2"
                           class="filter-input form-check-input"
                           value="varKelvin"
                           v-model="filterValues.features"
                           :disabled="isOptionDisabled('features', 'varKelvin')">
                    <label for="filter-feature-checkbox-2" class="filter-label form-check-label">Adjustable color temperature</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-3"
                           class="filter-input form-check-input"
                           value="multicolor"
                           v-model="filterValues.features"
                           :disabled="isOptionDisabled('features', 'multicolor')">
                    <label for="filter-feature-checkbox-3" class="filter-label form-check-label">Adjustable light color (RGB)</label>
                </div>
                <hr>
            </div>

            <!-- Connectivity -->
            <div class="filter-group">
                <h4 class="filter-group-heading">Connectivity <small>({{ filterValues.category === "hub" ? "all" : "any" }} of:)</small></h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-any"
                           class="filter-input form-check-input"
                           v-model="filterValues.anyNetwork"
                           :disabled="isOptionAnyDisabled('networks')"
                           @change="switchAnyOptionAny('networks')">
                    <label for="filter-network-checkbox-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-1"
                           class="filter-input form-check-input"
                           value="thread"
                           v-model="filterValues.networks"
                           :disabled="isOptionDisabled('networks', 'thread')"
                           @change="switchAnyOption('networks', 'thread')">
                    <label for="filter-network-checkbox-1" class="filter-label form-check-label">Thread</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-2"
                           class="filter-input form-check-input"
                           value="lan"
                           v-model="filterValues.networks"
                           :disabled="isOptionDisabled('networks', 'lan')"
                           @change="switchAnyOption('networks', 'lan')">
                    <label for="filter-network-checkbox-2" class="filter-label form-check-label">Wi-Fi / Ethernet</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-3"
                           class="filter-input form-check-input"
                           value="bluetooth"
                           v-model="filterValues.networks"
                           :disabled="isOptionDisabled('networks', 'bluetooth')"
                           @change="switchAnyOption('networks', 'bluetooth')">
                    <label for="filter-network-checkbox-3" class="filter-label form-check-label">Bluetooth</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-4"
                           class="filter-input form-check-input"
                           value="zigbee"
                           v-model="filterValues.networks"
                           :disabled="isOptionDisabled('networks', 'zigbee')"
                           @change="switchAnyOption('networks', 'zigbee')">
                    <label for="filter-network-checkbox-4" class="filter-label form-check-label">Zigbee</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-network-checkbox-5"
                           class="filter-input form-check-input"
                           value="zWave"
                           v-model="filterValues.networks"
                           :disabled="isOptionDisabled('networks', 'zWave')"
                           @change="switchAnyOption('networks', 'zWave')">
                    <label for="filter-network-checkbox-5" class="filter-label form-check-label">Z-Wave</label>
                </div>
                <hr>
            </div>

            <!-- Brand -->
            <div class="filter-group">
                <h4 class="filter-group-heading">Brand</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-brand-checkbox-any"
                           class="filter-input form-check-input"
                           v-model="filterValues.anyBrand"
                           :disabled="isOptionAnyDisabled('brands')"
                           @change="switchAnyOptionAny('brands')">
                    <label for="filter-brand-checkbox-any" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check" v-for="(brand, index) in optionsAllValues.allBrands" :key="brand">
                    <input type="checkbox"
                           :id="`filter-brand-checkbox-${index}`"
                           class="filter-input form-check-input"
                           :value="brand"
                           v-model="filterValues.brands"
                           :disabled="isOptionDisabled('brands', brand)"
                           @change="switchAnyOption('brands', brand)">
                    <label :for="`filter-brand-checkbox-${index}`" class="filter-label form-check-label">{{ brand }}</label>
                </div>
                <hr>
            </div>
        </div>
    </aside>
</template>

<script>
import { capitalize } from "vue";
import Events from "@/assets/javascript/events";
import FilterRules from "@/assets/javascript/dto/filter-rules";
import FilterValues from "@/assets/javascript/dto/filter-values";

export default {
    name: "DatabaseSidebar",

    props: {
        compatFiltersControl: Object,
        filterValues: FilterValues,
        filterRules: FilterRules,

        optionsAllValues: Object,
        replaceId: String
    },

    emits: [Events.REPLACE_DEVICE],

    computed: {
        activeFilterRules() {
            return this.compatFiltersControl.value ? this.filterRules : new FilterRules();
        },

        filterListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        // Cancel button callback
        cancelReplacement() {
            this.$eventBus.$emit(Events.REPLACE_DEVICE, null);
        },

        // Checkbox callbacks

        // Reset dependant filterValues on selection change
        categoryChanged() {
            this.filterValues.resetProperties("type", "formFactor", "features");
        },
        typeChanged() {
            this.filterValues.resetProperties("formFactor");
        },


        // Logic for toggling "Any" checkbox options
        // Ony "any" option value press, unchecks all other values and prevents own unselection.
        switchAnyOptionAny(option) {
            const anyOption = "any" + capitalize(option.slice(0, -1));
            this.filterValues[anyOption] = true;
            this.filterValues[option] = [];
        },
        // On option value press, checks/unchecks "any" value according to currently selected values
        // and prevents last value unselection when "any" value is disabled.
        switchAnyOption(option, value) {
            if (this.isOptionAnyDisabled(option) && this.filterValues[option].length <= 0) {
                this.filterValues[option].push(value);
            } else {
                const anyOption = "any" + capitalize(option.slice(0, -1));
                this.filterValues[anyOption] = this.filterValues[option].length <= 0;
            }
        },

        // Check disabled status
        isOptionDisabled(option, value) {
            if (!this.compatFiltersControl.value || (option === "networks" && this.filterValues.category === "hub")) {
                return false;
            }
            return (this.activeFilterRules[option].allowed !== "all" && !this.activeFilterRules[option].allowed.includes(value))
                || this.activeFilterRules[option].required.includes(value);
        },
        isOptionAnyDisabled(option) {
            if (!this.compatFiltersControl.value || (option === "networks" && this.filterValues.category === "hub")) {
                return false;
            }
            return this.activeFilterRules[option].allowed !== "all" || this.activeFilterRules[option].required.length > 0;
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

.cancel-replace-button {
    padding: 0.5rem;
}

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

small {
    font-weight: 400;
    font-size: 0.85em;
}

.filter-input:not(:disabled):hover, .filter-input:not(:disabled):focus {
    border: 1px solid var(--blue-logo);
}

.filter-input:not(:disabled):hover + .filter-label,
.filter-input:not(:disabled):focus + .filter-label {
    color: var(--blue-room-text);
}
</style>
