const DayIntlFormatter = new Intl.DateTimeFormat("ru", {
  dateStyle: "medium"
})
const DateTimeIntlFormatter = new Intl.DateTimeFormat("ru", {
  dateStyle: "medium",
  timeStyle: "short"
})

const DateTimeFullFormatter = Intl.DateTimeFormat("ru", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" })

export const CurrencyFormatter = Intl.NumberFormat("ru", {style: "currency", currency: "rub", minimumFractionDigits: 0})

export class DayFormatter {
  static format(arg: string | Date) {
    const date = typeof arg === "string" ? new Date(arg) : arg
    return DayIntlFormatter.format(date).replace("г.", "")
  }
}
export class DateTimeFormatter {
  static format(arg: string | Date, options: { full?: boolean } = {}) {
    const {full} = options
    const date = typeof arg === "string" ? new Date(arg) : arg
    if (full) {
      return DateTimeFullFormatter.format(date)
    }
    return DateTimeIntlFormatter.format(date).replace(" г.", "")
  }
}