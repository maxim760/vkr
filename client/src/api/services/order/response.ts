import { IUser } from "src/api/types/models/User"
import { IGoods, IGoodsItem } from "../goods/response"

export type IOrderUser = Pick<IUser, "firstName" | "lastName" | "id" | "phone" | "email">

export type IOrderItem = {
  id: string,
  user: IOrderUser,
  goods: IGoodsItem[],
  withDelivery: boolean,
  price: number,
  done: boolean,
  created_at: string;
}


export type IOrderData = {
  orders: IOrderItem[],
  totalCost: number,
}