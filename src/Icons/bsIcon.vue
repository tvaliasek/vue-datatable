<template>
    <component :is="component" />
</template>

<script setup lang="ts">
import bsIconArrowDown from './bsIconArrowDown.vue'
import bsIconArrowsExpand from './bsIconArrowsExpand.vue'
import bsIconArrowRepeat from './bsIconArrowRepeat.vue'
import bsIconArrowUp from './bsIconArrowUp.vue'
import bsIconPause from './bsIconPause.vue'
import { computed } from 'vue'

const props = defineProps<{
    icon: string
}>()

const component = computed(() => {
    switch (`${props.icon}`.toLowerCase()) {
        case 'arrow-down':
            return bsIconArrowDown
        case 'arrows-expand':
            return bsIconArrowsExpand
        case 'arrow-repeat':
            return bsIconArrowRepeat
        case 'arrow-up':
            return bsIconArrowUp
        case 'pause':
            return bsIconPause
    }
    return undefined
})
</script>
