import axios from "axios";
import { parse, valid } from 'node-html-parser';
import iconv from 'iconv-lite';
export const fetchHtml = async (url: string) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'  
    });
    const responseData = response.data
    const data = iconv.decode(responseData, "win1251"); // Декодируем данные с учетом кодировки

    if (typeof data !== "string") {
      throw new Error("not string")
    }
    return parse(data)
  } catch (error) {
    console.error(`Не удалось получить HTML`);
    return null
  }
}
