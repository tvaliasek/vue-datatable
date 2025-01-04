<template>
    <VfiFormInput
        :id="toValue(computedId)"
        :size="size"
        :type="type"
        :state="(invalid !== null) ? !invalid : undefined"
        :disabled="disabled"
        :formatter="formatValue"
        :placeholder="placeholder"
        :readonly="readOnly"
        :lazy-formatter="(lazyFormatter === false ? undefined : true)"
        :autocomplete="autocomplete"
        :name="name"
        :model-modifiers="modelModifiers"
        :model-value="model"
        @update:model-value="onUpdateModelValue"
        @change="onChange"
        @update="onUpdate"
        @blur="onBlur"
    />
</template>

<script setup lang="ts">
import type { Validation } from '@vuelidate/core'
import { computed, toValue, unref } from 'vue'
import { useInput } from './Composables/useInput'

import VfiFormInput from './Bootstrap/VfiFormInput.vue'
import useId from './Composables/useId'

export interface ComponentProps {
    label?: string
    type?: string
    size?: 'sm' | 'lg'
    validationMessages?: Record<string, any>
    validation?: Validation
    disabled?: boolean
    modelValue?: string | number | null
    hint?: string
    placeholder?: string
    formatter?: (value: string, event: Event) => string
    renderAsGroup?: boolean
    id?: string
    readOnly?: boolean
    showAsRequired?: boolean
    lazyFormatter?: boolean
    autocomplete?: string
    name?: string
    modelModifiers?: Record<'number' | 'lazy' | 'trim', boolean | undefined>
}

const props = withDefaults(
    defineProps<ComponentProps>(),
    {
        type: 'text',
        disabled: false,
        renderAsGroup: false,
        readOnly: false,
        lazyFormatter: true
    }
)

const computedId = computed(() => useId(props.id))

const $emit = defineEmits(['update:modelValue', 'change', 'update', 'blur'])

type modelType = string | number | undefined
const model = computed({
    get (): modelType {
        const modelValue = unref(props.modelValue)
        if (typeof modelValue === 'string' || typeof modelValue === 'number') {
            return modelValue
        }
        return undefined
    },
    set (value: modelType): void {
        $emit('update:modelValue', value)
        const validation = unref(props.validation)
        if (typeof validation?.$touch === 'function') {
            validation.$touch()
        }
    }
})

function onUpdateModelValue (value: modelType): void {
    model.value = value
}

const {
    isRequired,
    invalid,
    onUpdate,
    onChange,
    onBlur,
    formatValue
} = useInput(props, $emit)
</script>
