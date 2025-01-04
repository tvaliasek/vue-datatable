<template>
    <VfiFormGroup
        :description="hint"
        :id="toValue(computedId)"
        :class="{ 'form-group-required': isRequired }"
        :label="label"
        :disabled="disabled"
        :state="invalid === null ? invalid : !invalid"
    >
        <template #label>
            <slot name="label"></slot>
        </template>
        <div
            v-if="renderAsGroup"
            :class="[
                'input-group',
                {
                    'is-invalid': ((invalid !== null) ? !!invalid : undefined),
                    'is-valid': ((invalid !== null) ? !invalid : undefined)
                }
            ]"
        >
            <slot name="prepend"></slot>
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
            <slot name="append"></slot>
        </div>
        <VfiFormInput
            v-else
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
            :model-modifiers="modelModifiers"
            :model-value="model"
            :name="name"
            @update:model-value="onUpdateModelValue"
            @change="onChange"
            @update="onUpdate"
            @blur="onBlur"
        />
        <template #invalid-feedback
            v-if="invalid && validation"
        >
            <FormInputFeedbackMessage
                :validation-model="validation"
                :messages="validationMessages"
            />
        </template>
        <slot name="input-text"></slot>
    </VfiFormGroup>
</template>

<script setup lang="ts">
import type { Validation } from '@vuelidate/core'
import { computed, toValue, unref } from 'vue'
import { useInput } from './Composables/useInput'

import FormInputFeedbackMessage from './FormInputFeedbackMessage.vue'
import VfiFormGroup from './Bootstrap/VfiFormGroup.vue'
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
