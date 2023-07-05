export default function (date: any): string {
    date = new Date(date)
    return `${date.getDate()}.${date.getMonth() + 1}. ${date.getFullYear()}`
}
