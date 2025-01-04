<template>
    <template v-if="tag === 'a'">
        <a
            :href="href ?? '#'"
            :target="target ?? '_self'"
            :class="[
                'dropdown-item',
                {
                    'active': active
                }
            ]"
            :aria-current="active ? true : undefined"
        >
            <slot>
                {{ text ?? 'Dropdown Item' }}
            </slot>
        </a>
    </template>
    <template v-else>
        <button
            type="button"
            :class="[
                'dropdown-item',
                {
                    'active': active
                }
            ]"
            :aria-current="active ? true : undefined"
        >
            <slot>
                {{ text ?? 'Dropdown Item' }}
            </slot>
        </button>
    </template>
</template>

<script setup lang="ts">
export interface BDropdownItem {
    tag?: 'a' | 'button'
    href?: string
    text?: string
    active?: boolean
    target?: '_blank' | '_self'
}

withDefaults(defineProps<BDropdownItem>(), {
    tag: 'a'
})
</script>
