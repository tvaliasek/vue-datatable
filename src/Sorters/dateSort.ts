export default function (a: string | Date, b: string | Date): number {
    const aDate = (new Date(a)).valueOf() ?? 0
    const bDate = (new Date(b)).valueOf() ?? 0
    return ((aDate > bDate) ? 1 : ((aDate < bDate) ? -1 : 0))
}
