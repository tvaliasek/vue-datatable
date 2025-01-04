import { nextTick, onActivated, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import useAriaInvalid from './useAriaInvalid'
import useId from './useId'
import { useDebounceFn, useFocus } from '@vueuse/core'

export default (
    props: Readonly<{
        id?: string
        autofocus?: boolean
        formatter?: (value: string, evt: Readonly<Event>) => string
        lazyFormatter?: boolean
        disabled?: boolean
        ariaInvalid?: boolean | 'grammar' | 'spelling'
        state?: boolean | null
        modelModifiers?: Record<'number' | 'lazy' | 'trim', boolean | undefined>
    }>,
    modelValue: Ref<string | number | null>
): {
        input: Ref<HTMLInputElement | null>
        computedId: ComputedRef<string>
        computedAriaInvalid: ComputedRef<'grammar' | 'spelling' | 'true' | 'false' | undefined>
        onInput: (evt: Readonly<Event>) => void
        onChange: (evt: Readonly<Event>) => void
        onBlur: (evt: Readonly<FocusEvent>) => void
        focus: () => void
        blur: () => void
    } => {
    const computedId = useId(() => props.id)
    const input = ref<HTMLInputElement | null>(null)

    const internalUpdateModelValue = useDebounceFn(
        (value: string | number) => {
            modelValue.value = value
        },
        () => (props.modelModifiers?.lazy === true ? 0 : 50),
        { maxWait: () => (props.modelModifiers?.lazy === true ? NaN : 500) }
    )

    const updateModelValue = (value: string | number, force = false): void => {
        if (props.modelModifiers?.lazy === true && !force) {
            return
        }
        void internalUpdateModelValue(value)
    }

    const { focused } = useFocus(input, {
        initialValue: props.autofocus
    })

    const _formatValue = (value: string, evt: Readonly<Event>, force = false): string => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (props.formatter !== undefined && (!props.lazyFormatter || force)) {
            return props.formatter(value, evt)
        }
        return value
    }

    onMounted(() => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (input?.value) {
            input.value.value = modelValue?.value?.toString() ?? ''
        }
    })

    onActivated(() => {
        void nextTick(() => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (props?.autofocus) {
                focused.value = true
            }
        })
    })

    const computedAriaInvalid = useAriaInvalid(
        () => props.ariaInvalid,
        () => props.state
    )

    const onInput = (evt: Readonly<Event>): void => {
        const { value } = evt.target as HTMLInputElement
        const formattedValue = _formatValue(value, evt)
        if (evt.defaultPrevented) {
            evt.preventDefault()
            return
        }

        const nextModel = formattedValue
        updateModelValue(nextModel)
    }

    const onChange = (evt: Readonly<Event>): void => {
        const { value } = evt.target as HTMLInputElement
        const formattedValue = _formatValue(value, evt)
        if (evt.defaultPrevented) {
            evt.preventDefault()
            return
        }

        const nextModel = formattedValue
        if (modelValue?.value !== nextModel) {
            updateModelValue(formattedValue, true)
        }
    }

    const onBlur = (evt: Readonly<FocusEvent>): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!props.modelModifiers?.lazy && !props.lazyFormatter) {
            return
        }

        const { value } = evt.target as HTMLInputElement
        const formattedValue = _formatValue(value, evt, true)

        const nextModel = formattedValue
        if (modelValue?.value !== nextModel) {
            updateModelValue(formattedValue, true)
        }
    }

    const focus = (): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!props.disabled) {
            focused.value = true
        }
    }

    const blur = (): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!props.disabled) {
            focused.value = false
        }
    }

    return {
        input,
        computedId,
        computedAriaInvalid,
        onInput,
        onChange,
        onBlur,
        focus,
        blur
    }
}
