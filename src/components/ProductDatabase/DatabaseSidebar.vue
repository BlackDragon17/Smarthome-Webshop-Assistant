<template>
    <aside class="sidebar">
        <p>Sidebar</p>
    </aside>
</template>

<script>
export default {
    name: "DatabaseSidebar"
};
</script>

<style scoped>
/* Sidebar styles */

.sidebar {
    width: 340px;
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
</style>
