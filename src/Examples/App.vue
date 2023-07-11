<template>
    <BNavbar sticky="top" class="bg-white shadow-sm">
        <BNavbarBrand :to="{ name: 'ExampleHome' }">
            Examples
        </BNavbarBrand>
        <BNavbarNav>
            <BNavItem :to="{ name: 'ExampleHome' }">
                Complex
            </BNavItem>
            <BNavItem :to="{ name: 'ExampleCustomButtons' }">
                Custom buttons
            </BNavItem>
        </BNavbarNav>
    </BNavbar>
    <RouterView />
</template>

<script setup lang="ts">
</script>
