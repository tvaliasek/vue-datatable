const formatter = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' })

export default function (value: any): string {
    return formatter.format(value)
}
