<template>
    <aside class="sidebar">
        <h3 class="sidebar-heading">Filter products</h3>
        <hr>
        <div class="filter-list">
            <div class="filter-group">
                <h4 class="filter-group-heading">Category</h4>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-1"
                           class="filter-input form-check-input"
                           name="category"
                           value="all"
                           v-model="selectedCategory"
                           checked>
                    <label for="filter-category-radio-1" class="filter-label form-check-label">All</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-2"
                           class="filter-input form-check-input"
                           name="category"
                           value="hub"
                           v-model="selectedCategory">
                    <label for="filter-category-radio-2" class="filter-label form-check-label">Hubs</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-3"
                           class="filter-input form-check-input"
                           name="category"
                           value="light"
                           v-model="selectedCategory">
                    <label for="filter-category-radio-3" class="filter-label form-check-label">Lights</label>
                </div>
                <div class="form-check">
                    <input type="radio"
                           id="filter-category-radio-4"
                           class="filter-input form-check-input"
                           name="category"
                           value="sensor"
                           v-model="selectedCategory">
                    <label for="filter-category-radio-4" class="filter-label form-check-label">Sensors</label>
                </div>
                <hr>
            </div>

            <div class="filter-group">
                <h4 class="filter-group-heading">Features</h4>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-1"
                           class="filter-input form-check-input"
                           value="varLumen"
                           v-model="selectedFeatures">
                    <label for="filter-feature-checkbox-1" class="filter-label form-check-label">Adjustable brightness</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-2"
                           class="filter-input form-check-input"
                           value="varKelvin"
                           v-model="selectedFeatures">
                    <label for="filter-feature-checkbox-2" class="filter-label form-check-label">Adjustable color temperature</label>
                </div>
                <div class="form-check">
                    <input type="checkbox"
                           id="filter-feature-checkbox-3"
                           class="filter-input form-check-input"
                           value="multicolor"
                           v-model="selectedFeatures">
                    <label for="filter-feature-checkbox-3" class="filter-label form-check-label">Adjustable light color (RGB)</label>
                </div>
                <hr>
            </div>

            <div class="filter-group">
                <h4 class="filter-group-heading">Brand</h4>
                <div class="form-check" v-for="(brand, index) in allBrands" :key="brand">
                    <input type="checkbox"
                           :id="`filter-brand-checkbox-${index}`"
                           class="filter-input form-check-input"
                           :value="brand"
                           v-model="selectedBrands">
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

    data() {
        return {
            selectedCategory: "all",
            selectedFeatures: [],
            selectedBrands: []
        };
    },

    props: {
        allBrands: Array
    },

    computed: {
        filterListBorder() {
            return import.meta.env.PROD || this.hideBorders ? "none" : "1px solid darkgoldenrod";
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

.filter-input:not(:disabled):hover {
    border: 1px solid var(--blue-logo);
}

.filter-input:not(:disabled) + .filter-label:hover {
    color: var(--blue-room-text);
}
</style>
