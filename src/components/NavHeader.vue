<template>
    <header>
        <nav class="header" ref="header">
            <a href="#" class="logo" @click="headerAction('logo')">SH<span>WA</span></a>
            <ul class="header-nav">
                <li><a href="#" @click="headerAction('setup')">Home Setup</a></li>
                <li><a href="#" @click="headerAction('database')">Product Database</a></li>
            </ul>
        </nav>

        <teleport to="head">
            <!-- TODO: Figure out why light colors aren't getting applied -->
            <meta name="theme-color" :content="headerColor" media="(prefers-color-scheme: light)">
        </teleport>
    </header>
</template>

<script>
export default {
    name: "NavHeader",

    emits: ["header-click"],

    computed: {
        headerColor() {
            return getComputedStyle(document.documentElement).getPropertyValue("--nav-header-bg");
        }
    },

    methods: {
        headerAction(target) {
            this.$emit("header-click", target);
        }
    }
};
</script>

<style scoped>
header {
    background-color: var(--nav-header-bg);
    border-bottom: 1px solid #777;
    position: sticky;
    top: 0;
    z-index: 2;
}

/* Outer flex box to align navbar with logo */
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

.logo {
    /* border: 1px solid darkred; */
    padding: 0.2rem 1rem;
    font-size: 1.8rem;
    font-weight: 700;
}

.logo :first-child {
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

.header-nav > li > a {
    padding: 0.5rem;
    color: #222;
    font-size: 1.3rem;
    font-weight: 600;
}
</style>
