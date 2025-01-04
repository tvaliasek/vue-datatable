import {computed, type ComputedRef, inject, type MaybeRefOrGetter, toValue} from 'vue'

export const getId = (suffix = '') => {
    const id = Math.random().toString().slice(2, 10)
    return `VFIID_${id}${suffix ? '_' : ''}${suffix}`
}

export default (id?: MaybeRefOrGetter<string | undefined>, suffix?: string): ComputedRef<string> => computed(() => toValue(id) || getId(suffix))
