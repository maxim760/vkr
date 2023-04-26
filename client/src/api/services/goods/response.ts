import { IProduct } from "../product/response"

export type IGoods = {
  id: string,
  goodsType: string,
  description: string,
  discount: number,
  price: number,
  currentPrice: number,
  name: string,
  img: string,
  products: IProduct[]
}

export type IGoodsResponse = IGoods & {left: number}