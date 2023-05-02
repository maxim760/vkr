import { PHONE_LENGTH } from "./forms"

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

export class PhoneFormatter {
  static format(str: string, locale: string = "ru") {
    if (str.length !== PHONE_LENGTH) {
      return str
    }
    const match = str.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (!match?.length) {
      return str
    }
    let phone = `(${match[0]}) ${match[1]}-${match[2]}-${match[3]}`
    if (locale === "ru") {
      phone = "+7" + phone
    }
    return phone

  }
}