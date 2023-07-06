<template>
    <BFormInput
        size="sm"
        v-model="localFilterValue"
        :placeholder="i18n.search"
    />
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch, computed, ref } from 'vue'

const props = defineProps<{
    i18n: Record<string, string>
    dataField: string
    filter: Record<string, string>
}>()

const $emit = defineEmits(['filter'])

const tm = ref<any>(null)
const localFilterValue = ref<string>(((props.filter.hasOwnProperty(props.dataField)) ? (props.filter[props.dataField] ?? '') : ''))

const filterValue = computed({
    get () {
        if (props.filter.hasOwnProperty(props.dataField)) {
            return props.filter[props.dataField] ?? ''
        }
        return ''
    },
    set (value: string) {
        const filter = JSON.parse(JSON.stringify(props.filter))
        filter[props.dataField] = `${value}`
        $emit('filter', filter)
    }
})

watch(localFilterValue, (newValue) => {
    const value = `${newValue}`
    window.clearTimeout(tm.value)
    window.setTimeout(() => {
        filterValue.value = value
    }, 500)
}
)

onBeforeUnmount(() => { window.clearTimeout(tm.value) })
</script>
