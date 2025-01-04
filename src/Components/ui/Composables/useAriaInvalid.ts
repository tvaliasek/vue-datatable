import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

export type AriaInvalid = boolean | 'grammar' | 'spelling'

export default (
    ariaInvalid: MaybeRefOrGetter<AriaInvalid | undefined>,
    state: MaybeRefOrGetter<boolean | null | undefined>
): ComputedRef<'grammar' | 'spelling' | 'true' | 'false' | undefined> => computed(() => {
    const resolvedAriaInvalid = toValue(ariaInvalid)
    const resolvedState = toValue(state)

    const resolvedAriaInvalidValue =
      resolvedAriaInvalid === true
          ? 'true'
          : typeof resolvedAriaInvalid === 'string'
              ? resolvedAriaInvalid
              : resolvedState === false
                  ? 'true'
                  : resolvedAriaInvalid === false
                      ? 'false'
                      : undefined

    return resolvedAriaInvalidValue
})
