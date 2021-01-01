export default function (a, b) {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    const result = collator.compare(`${a}`, `${b}`)
    return ((result > 0) ? 1 : ((result < 0) ? -1 : 0))
}
