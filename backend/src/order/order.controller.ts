import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, TypedRequestQuery, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import {And, ILike, MoreThanOrEqual, LessThanOrEqual, In} from "typeorm"
import { Product } from "../product/product.entity";
import { orderGoodsRepo, orderRepo } from "./order.repo";
import { curierRepo } from "../curier/curier.repo";
import { Order } from "./order.entity";
import { goodsRepo } from "../goods/goods.repo";
import { time } from "console";
import { OrderGoods } from "./order-goods.entity";
import { Goods } from "../goods/goods.entity";

class OrderController {
  async getAll(req: Request, res: Response) {
    const {id, roles} = req.user || {}
    if (!req.user?.id) {
      return res.status(403).json({data: null, message: "Нет доступа"})
    }
    const isAdmin = (roles || []).includes(UserRole.Admin)
    const orders = await orderRepo.find({
      ...(isAdmin ? {} : { where: { user: {id} } }),
      relations: { curier: true, user: true, goods: true, orderToGoods: {goods: true} },
      select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true } },
      order: { "created_at": "desc" },
    })
    // const orders = await orderRepo.createQueryBuilder("orders")
    //   .leftJoinAndSelect("orders.curier", "curier")
    //   .leftJoinAndSelect("orders.user", "user")
    //   .leftJoinAndSelect("orders.goods", "goods")
    //   .leftJoinAndSelect("orders.goodsToOrder", "goodsToOrder")
    //   .leftJoinAndSelect("goodsToOrder.goods", "orderGoodsGoods")
    //   .select("user.firstName")
    //   .addSelect("user.lastName")
    //   .addSelect("user.id")
    //   .addSelect("user.phone")
    //   .addSelect("user.email")
    //   .orderBy("orders.created_at", "DESC")
    //   .where(isAdmin ? "1=1" : "user.id = :id", { id })
    //   .distinct(false)
    //   .getMany();
    const totalCost = await orderRepo.sum("price", isAdmin ? undefined : { user: {id} })
    return res.json({
      orders,
      totalCost
    })
  }
  async create(req: TypedRequestBody<OmitCreateEntity<Order, "goods"> & { goods: string[], userId: string, deliveryCost: number }>, res: Response) {
    const currentUser = await userRepo.findOneByOrFail({id: req.user?.id})
    const { goods, userId, withDelivery, deliveryCost } = req.body
    if (!goods.length) {
      return res.status(400).json({ message: 'Блюд не выбрано' });
    }
    const goodsFromDbUniq = await goodsRepo.find({ where: { id: In(goods) }, relations: { products: true } })
    const goodsFromDb = goodsFromDbUniq.flatMap(item => new Array(goods.filter(id => id === item.id).length).fill("").flatMap(() => item))
    const productsMap = goodsFromDb
      .flatMap(item => item.products)
      .map(({ count, id }) => ({ id, count, totalCount: count }))
      .reduce((acc, item) => {
        return {
          ...acc,
          [item.id]: (acc[item.id] === undefined ? item.totalCount : acc[item.id]) - 1
        }
      }, {} as { [key: string]: number })
    if (Object.values(productsMap).some(item => item < 0)) {
      return res.status(400).json({ message: 'Недостаточно ингредиентов на складе' });
    }
    let totalPrice = goodsFromDb.reduce((acc, item) => acc + item.currentPrice, 0)
    if (totalPrice === null) {
      return res.status(400).json({ message: 'Ошибка при вычислении стоимости' });
    }
    const item = new Order()
    item.done = !withDelivery
    item.withDelivery = withDelivery
    item.goods = []
    item.user = { id: userId } as User
    if(withDelivery) {
      totalPrice += deliveryCost;
      const curiers = await curierRepo.find({ where: { status: CurierStatus.Free }, relations: {orders: true} });
      if(!curiers.length) {
        return res.status(400).json({ message: "Нет свободных курьеров" });
      }
      const count = curiers.length;
      const randomIdx = Math.floor(Math.random() * count);
      const curier = curiers[randomIdx];
      curier.status = CurierStatus.Busy
      curier.orders ||= []
      curier.orders.push(item);
      await curierRepo.save(curier);
    }
    if(totalPrice > currentUser.cash) {
      return res.status(400).json({ message: "Недостаточно денег на балансе" });
    }
    item.price = totalPrice
    await orderRepo.save(item)
    // const orderToGoods: OrderGoods[] = []
    // for (let goods of goodsFromDb) {
    //   const orderGoods = new OrderGoods()
    //   orderGoods.goods = { id: goods.id } as Goods
    //   orderGoods.goods_id = goods.id
    //   orderGoods.order = item
    //   orderGoods.order_id = item.id
    //   await orderGoodsRepo.save(orderGoods)
    //   orderToGoods.push(orderGoods)
    // }
    // item.orderToGoods = orderToGoods
    // await orderRepo.save(item)
    
    currentUser.cash -= totalPrice
    item.goods = goodsFromDb
    await userRepo.save(currentUser)
    const result = await orderRepo.save(item)
    console.log(result)
    console.log(item.goods.length)
    return res.json({data: true})

  }

  async confirmOrder(req: TypedRequestParams<{ id: string }>, res: Response) {
    const { id } = req.params
    const isAdmin = (req.user?.roles || []).includes(UserRole.Admin)
    if (!isAdmin && id === req.user?.id) {
      return res.status(403).json("Нет доступа к этой функции")
    }
    const itemFromDb = await orderRepo.findOneByOrFail({id})
    const curier = itemFromDb.curier;
    if(curier != null) {
        curier.status = CurierStatus.Free;
        curierRepo.save(curier);
    }
    itemFromDb.done = true;
    await orderRepo.save(itemFromDb);
    return res.json({data: true})
  }
  
}
export default new OrderController