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
                v-if="tag === 'a'"
                :href="href ?? '#'"
                :target="target ?? '_self'"
            >
                {{ text ?? 'Dropdown Item' }}
            </a>
            <button
                v-else
                type="button"
            >
                {{ text ?? 'Dropdown Item' }}
            </button>
        </slot>
    </div>
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
