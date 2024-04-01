import { fetchHtml } from "./utils"

export const parseRussianFood = async (url: string) => {
  try {
    const html = await fetchHtml(url)

    if (!html) {
      return null;
    }
    let mainTitle = html.querySelector(".recipe_new h1.title")?.textContent || ""
    if (mainTitle) {
      mainTitle += " russianfood.com"
    }
    console.log('mainTitle', mainTitle)
    let ingrs = [...html.querySelectorAll("table.ingr [class^=\"ingr_tr\"] span")].map(item => item?.textContent || "").map(str => {
      const splitted = str.split("-")
      const [name, size] = [
        splitted.slice(0, splitted.length - 1).join("-").trim(),
        (splitted[splitted.length - 1] || "").trim()
      ]
      return {name, size}
    })
    console.log('ingrs', ingrs)
    
    const description = html.querySelector(".recipe_new > tr:nth-child(2) > td > div:last-child")?.textContent || ""
    console.log('description', description)
    const subInfo = html.querySelector(".sub_info")
    console.log('subInfo', subInfo)
    const portionCount = +(subInfo?.querySelector("div.el:first-of-type .hl b")?.textContent ?? 1)
    console.log('portionCount', portionCount)
    const time = subInfo?.querySelector("div.el:nth-of-type(2)")?.textContent.trim() || ""
    console.log('time', time)
    let steps = [...html.querySelectorAll(".step_images_n > .step_n")].map(item => {
      let img = (item.querySelector(".img_c a")?.getAttribute("href") ?? '').trim() || ""
      if (img.startsWith("//")) {
        img = "https:" + img
      }
      const text = item.querySelector("> p")?.textContent?.trim?.() ?? '';
      return {
        images: [img], text
      }
    })
    if (!steps.length) {
      steps = [...html.querySelector("#how")?.querySelectorAll?.("> p") ?? []]
        .map(item => item?.textContent?.trim())
        .filter(Boolean)
        .map(text => ({images: [], text})
      )
    }
    console.log('steps', steps)
    if (!mainTitle || !steps.length) {
      throw new Error("mainTitle and steps required")
    }
    return {
      mainTitle,
      ingrs,
      description,
      portionCount,
      time,
      steps
    }

  } catch (e) {
    console.log("error")
    console.log(e)
    return null
  }
}


module.exports = {parseRussianFood}