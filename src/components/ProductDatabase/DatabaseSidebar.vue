<template>
    <aside class="sidebar">
        <h3 class="sidebar-heading">Filter products</h3>
        <div class="compatibility-switch form-check form-switch">
            <input type="checkbox" role="switch" id="compatibility-switch" class="filter-input form-check-input" name="compatibility">
            <label for="compatibility-switch" class="filter-label form-check-label">Compatibility filters</label>
        </div>
        <hr>
        <div class="filter-list">
            <div class="filter-group" @change="categoryChanged">
                <h4 class="filter-group-heading">Category</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-1"
                           class="filter-input form-check-input"
                           name="category"
                           value="all"
                           v-model="filters.category">
                    <label for="filter-category-radio-1" class="filter-label form-check-label">All</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-2"
                           class="filter-input form-check-input"
                           name="category"
                           value="hub"
                           v-model="filters.category">
                    <label for="filter-category-radio-2" class="filter-label form-check-label">Hubs</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-3"
                           class="filter-input form-check-input"
                           name="category"
                           value="light"
                           v-model="filters.category">
                    <label for="filter-category-radio-3" class="filter-label form-check-label">Lights</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-4"
                           class="filter-input form-check-input"
                           name="category"
                           value="sensor"
                           v-model="filters.category">
                    <label for="filter-category-radio-4" class="filter-label form-check-label">Sensors</label>
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filters.category !== 'all'" @change="typeChanged">
                <h4 class="filter-group-heading">Type of {{ filters.category }}</h4>
                <div v-if="filters.category === 'hub'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="open"
                               v-model="filters.type">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Open</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="proprietary"
                               v-model="filters.type">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Proprietary</label>
                    </div>
                </div>

                <div v-else-if="filters.category === 'light'">
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-1"
                               class="filter-input form-check-input"
                               name="type"
                               value="lamp"
                               v-model="filters.type">
                        <label for="filter-type-radio-1" class="filter-label form-check-label">Lamp</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-2"
                               class="filter-input form-check-input"
                               name="type"
                               value="bulb"
                               v-model="filters.type">
                        <label for="filter-type-radio-2" class="filter-label form-check-label">Bulb</label>
                    </div>
                    <div class="form-check">
                        <input type="radio"
                               id="filter-type-radio-3"
                               class="filter-input form-check-input"
                               name="type"
                               value="lightStrip"
                               v-model="filters.type">
                        <label for="filter-type-radio-3" class="filter-label form-check-label">Light strip</label>
                    </div>
                </div>

                <div v-else-if="filters.category === 'sensor'">
                    Placeholder
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filters.type === 'bulb'">
                <h4 class="filter-group-heading">Form factor</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-1"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e14"
                           v-model="filters.formFactor">
                    <label for="filter-form-factor-radio-1" class="filter-label form-check-label">E14</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-form-factor-radio-2"
                           class="filter-input form-check-input"
                           name="formFactor"
                           value="e27"
                           v-model="filters.formFactor">
                    <label for="filter-form-factor-radio-2" class="filter-label form-check-label">E27</label>
                </div>
                <hr>
            </div>

            <div class="filter-group" v-if="filters.category === 'light'">
                <h4 class="filter-group-heading">Features</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-1"
                           class="filter-input form-check-input"
                           value="varLumen"
                           v-model="filters.features">
                    <label for="filter-feature-checkbox-1" class="filter-label form-check-label">Adjustable brightness</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-2"
                           class="filter-input form-check-input"
                           value="varKelvin"
                           v-model="filters.features">
                    <label for="filter-feature-checkbox-2" class="filter-label form-check-label">Adjustable color temperature</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-3"
                           class="filter-input form-check-input"
                           value="multicolor"
                           v-model="filters.features">
                    <label for="filter-feature-checkbox-3" class="filter-label form-check-label">Adjustable light color (RGB)</label>
                </div>
                <hr>
            </div>

            <div class="filter-group">
                <h4 class="filter-group-heading">Brand</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-brand-checkbox-all"
                           class="filter-input form-check-input"
                           v-model="filters.anyBrand"
                           @change="checkboxAllBrands">
                    <label for="filter-brand-checkbox-all" class="filter-label form-check-label">Any</label>
                </div>
                <div class="form-check" v-for="(brand, index) in allBrands" :key="brand">
                    <input type="checkbox"
                           :id="`filter-brand-checkbox-${index}`"
                           class="filter-input form-check-input"
                           :value="brand"
                           v-model="filters.brands"
                           @change="checkboxBrand">
                    <label :for="`filter-brand-checkbox-${index}`" class="filter-label form-check-label">{{ brand }}</label>
                </div>
                <hr>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: "DatabaseSidebar",

    props: {
        filters: Object,
        allBrands: Array
    },

    computed: {
        filterListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
        }
    },

    methods: {
        // Checkbox callbacks

        // Reset dependant filters on selection change
        categoryChanged() {
            this.filters.type = "";
            this.filters.formFactor = "";
            this.filters.features = [];
        },
        typeChanged() {
            this.filters.formFactor = "";
        },

        // Brand selection logic
        checkboxAllBrands() {
            this.filters.anyBrand = true;
            this.filters.brands = [];
        },
        checkboxBrand() {
            this.filters.anyBrand = this.filters.brands.length <= 0;
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
