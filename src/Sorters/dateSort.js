export default function (a, b) {
    const aDate = (new Date(a)).valueOf() || 0
    const bDate = (new Date(b)).valueOf() || 0
    return ((aDate > bDate) ? 1 : ((aDate < bDate) ? -1 : 0))
}
