<template>
    <header class="header-background">
        <nav class="header">
            <a href="#" class="header-logo">SH<span>WA</span></a>
            <ul class="header-nav">
                <li><a href="#" ref="homeSetupItem" class="header-nav-item" @click="headerAction('HomeSetup')">Home Setup</a></li>
                <li><a href="#" ref="productDatabaseItem" class="header-nav-item" @click="headerAction('ProductDatabase')">Product Database</a></li>
            </ul>
        </nav>
        <ActivePageIndicator :target-el="activeNavItem"/>

        <!-- TODO: Figure out why light colors aren't getting applied -->
        <Teleport to="head">
            <meta name="theme-color" :content="headerColor" media="(prefers-color-scheme: light)">
        </Teleport>
    </header>
</template>

<script>
import ActivePageIndicator from "./ActivePageIndicator.vue";

export default {
    name: "NavHeader",

    components: {
        ActivePageIndicator
    },

    data() {
        return {
            activeNavItem: null
        };
    },

    props: {
        activeView: String
    },

    emits: ["header-click"],

    computed: {
        headerColor() {
            return getComputedStyle(document.documentElement).getPropertyValue("--nav-header-bg");
        }
    },

    methods: {
        headerAction(target) {
            this.$eventBus.$emit("header-click", target);
        },

        // This can't be a computed property since those run pre-mount, and would thus return undefined.
        setActivePage() {
            switch (this.activeView) {
                case "HomeSetup":
                    this.activeNavItem = this.$refs.homeSetupItem;
                    break;
                case "ProductDatabase":
                    this.activeNavItem = this.$refs.productDatabaseItem;
                    break;
            }
        }
    },

    watch: {
        activeView() {
            this.setActivePage()
        }
    },

    mounted() {
        this.setActivePage();
    }
};
</script>

<style scoped>
.header-background {
    background-color: var(--nav-header-bg);
    border-bottom: 1px solid #777;
    position: sticky;
    top: 0;
    z-index: 4;
}

/* Outer flex box to align navbar-list with header logo */
.header {
    margin: 0 5vw;
    padding: 0.3rem;
    /* max-width: 1800px; */
    display: flex;
    align-items: center;
}

@media screen and (max-width: 1100px) {
    .header {
        margin: 0 auto;
        max-width: 990px;
    }
}

.header a {
    display: block;
    text-decoration: none;
    color: #111;
}

.header-logo {
    /* border: 1px solid darkred; */
    padding: 0.2rem 1rem;
    font-size: 1.8rem;
    font-weight: 700;
}

.header-logo :first-child {
    color: var(--blue-logo);
}

/* Inner flex box to align nav items */
.header-nav {
    /* border: 1px solid darkgreen; */
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.header-nav > li {
    /* border: 1px solid darkred; */
}

.header-nav-item {
    box-sizing: content-box;
    padding: 0.5rem;
    color: #222;
    font-size: 1.3rem;
    font-weight: 600;
}

.header-nav-item:hover, .header-nav-item:focus {
    background-color: var(--gray-button-hover);
    border-radius: var(--button-border-radius);
}
</style>
