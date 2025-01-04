export default (
    value: string | number | null,
    modelModifiers: Record<'number' | 'lazy' | 'trim', true | undefined>
): string | undefined => {
    if (value === null) {
        return
    }
    let update = value
    if (modelModifiers?.trim) {
        update = update.toString().trim()
    }
    if (modelModifiers?.number && typeof update === 'string' && update !== '') {
        const parsed = Number.parseFloat(update)
        update = Number.isNaN(parsed) ? update : parsed
    }
    return update
}
