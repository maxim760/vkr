export type IProduct = {
  id: string,
  count: string,
  name: string,
}

export type IProductsResponse = {
  products: IProduct[]
}