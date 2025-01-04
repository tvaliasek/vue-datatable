<template>
    <div
        :class="[
            'dropdown-item',
            {
                'active': active
            }
        ]"
        :aria-current="active ? true : undefined"
    >
        <slot>
            <a
                :href="href ?? '#'"
                :target="target ?? '_self'"
            >
                {{ text ?? 'Dropdown Item' }}
            </a>
        </slot>
    </div>
</template>

<script setup lang="ts">
export interface BDropdownItem {
    href?: string
    text?: string
    active?: boolean
    target?: '_blank' | '_self'
}

defineProps<BDropdownItem>()
</script>
