<template>
    <div>
        <BButton
            size="sm"
            variant="warning"
            @click.prevent="onTag"
        >
            <BiTag />
        </BButton>
    </div>
</template>

<script lang="ts" setup>
import BiTag from './Icons/BiTag.vue'

const $emit = defineEmits(['action'])
const props = defineProps<{
    row: Record<string, any>
}>()

function onTag (): void {
    $emit('action', { event: 'tag', row: props.row })
}
</script>
