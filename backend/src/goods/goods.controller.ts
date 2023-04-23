import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, TypedRequestQuery, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { goodsRepo } from "./goods.repo";
import {And, ILike, MoreThanOrEqual, LessThanOrEqual} from "typeorm"
import { Goods } from "./goods.entity";
import { Product } from "../product/product.entity";

class GoodsController {
  async getAll(req: TypedRequestQuery<{min: number, max: number, query: string}>, res: Response) {
    const {max, min, query} = req.query
    if (!req.user?.id) {
      return res.status(403).json({data: null, message: "Нет доступа"})
    }
    const result = await goodsRepo.find({
      where: [
        {name: ILike(query)},
        {description: ILike(query)},
        {currentPrice: And(MoreThanOrEqual(Math.max(0, min)), LessThanOrEqual(max || Infinity))}
      ]
    })
    return res.json(result)
  }
  async editItem(req: TypedRequestBody<Goods>, res: Response) {
    const { id, name, description, price, img } = req.body
    if (price <= 0) {
      return res.status(400).json({ message: 'Нельзя установить цену меньше или равную 0' });
    }
    const itemFromDb = await goodsRepo.findOneByOrFail({ id })
    itemFromDb.name = name;
    itemFromDb.description = description;
    itemFromDb.img = img;
    itemFromDb.price = price;
    itemFromDb.currentPrice = Math.ceil(price * (100 - itemFromDb.discount) / 100);
    itemFromDb.description = description;
    const result = await goodsRepo.save(itemFromDb);
    return res.json(result)

  }
  async create(req: TypedRequestBody<OmitCreateEntity<Goods, "products"> & {products: string[]}>, res: Response) {
    const {name, price, description, img, goodsType, products} = req.body
    if (price <= 0) {
      return res.status(400).json({ message: 'Нельзя установить кол-во цену меньше или равную 0' });
    }
    const item = new Goods()
    item.name = name
    item.price = price
    item.currentPrice = price
    item.discount = 0
    item.goodsType = goodsType
    item.img = img
    item.description = description
    item.products = products.map( item=> ({id: item})) as Product[]
    const result = await goodsRepo.save(item)
    return res.json(result)

  }
  async editDiscount(req: TypedRequestBody<{ discount: number, id: string }>, res: Response) {
    const {discount, id} = req.body
    if (discount <= 0 || discount >= 100) {
      return res.status(400).json({ message: 'Некорректный процент скидки' });
    }
    const itemFromDb = await goodsRepo.findOneByOrFail({ id })
    itemFromDb.discount = discount;
    const result = await goodsRepo.save(itemFromDb);
    return res.json(result)

  }

  async editProducts(req: TypedRequestBody<{ products: string[], id: string }>, res: Response) {
    const {products, id} = req.body
    if (products.length === 0) {
      return res.status(400).json({ message: 'Некорректный список ингредиентов' });
    }
    const itemFromDb = await goodsRepo.findOneByOrFail({ id })
    itemFromDb.products = products.map(item => ({id: item})) as Product[];
    const result = await goodsRepo.save(itemFromDb);
    return res.json(result)

  }
  
}
export default new GoodsController