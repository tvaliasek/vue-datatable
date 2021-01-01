export default function (date) {
    date = new Date(date)
    return `${date.getDate()}.${date.getMonth() + 1}. ${date.getFullYear()} ${date.getHours()}:${((date.getMinutes() < 10) ? '0' : '') + date.getMinutes()}:${((date.getSeconds() < 10) ? '0' : '') + date.getSeconds()}`
}
