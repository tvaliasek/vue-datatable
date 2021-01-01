const formatter = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' })

export default function (value) {
    return formatter.format(value)
}
