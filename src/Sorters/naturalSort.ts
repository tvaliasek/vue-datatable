const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export default function (a: any, b: any): number {
    const result = collator.compare(`${a}`, `${b}`)
    return ((result > 0) ? 1 : ((result < 0) ? -1 : 0))
}
