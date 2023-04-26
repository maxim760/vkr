import { IProduct } from "./response";

export type EditProductDto = IProduct
export type CreateProductDto = Pick<IProduct, "count" | "name">
