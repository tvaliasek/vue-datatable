import { computed, unref } from 'vue'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useInput (props: Record<string, any>, $emit: (event: any, ...args: any) => void) {
    const isRequired = computed(() => {
        const showAsRequired = unref(props.showAsRequired)
        if (showAsRequired === false || showAsRequired === true) {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return !!showAsRequired
        }
        if (props.validation !== undefined) {
            const validationValue = JSON.parse(JSON.stringify(props.validation))
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (validationValue && typeof validationValue === 'object') {
                return Object.keys(validationValue).filter(propName => !`${propName}`.startsWith('$')).length > 0
            }
        }
        return false
    })

    const invalid = computed(() => {
        const validation = unref(props.validation)
        if (validation?.$invalid !== undefined) {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return (validation.$dirty) ? validation.$invalid : null
        }
        return null
    })

    const onEvent = (eventName: 'change' | 'update' | 'blur') => {
        return (eventData: unknown) => {
            $emit(eventName, eventData)
        }
    }

    const onChange = onEvent('change')
    const onUpdate = onEvent('update')
    const onBlur = onEvent('blur')

    const formatValue = function (value: string, event?: Event): string {
        const formatter = unref(props.formatter)
        if (typeof formatter === 'function') {
            return formatter(value, event)
        }
        return value
    }

    return {
        isRequired,
        invalid,
        onChange,
        onUpdate,
        onBlur,
        onEvent,
        formatValue
    }
}
