import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { CreateProductDto, EditProductDto } from "./dto";
import { IProduct, IProductsResponse } from "./response";

class ProductApi {
  static path(nextPath: string) {
    return "/product" + nextPath
  }
  async create(dto: CreateProductDto) {
    const { data } = await api.post<DefaultSuccessResponse>(ProductApi.path("/create"), dto)
    return data
  }
  async edit(dto: EditProductDto) {
    const { data } = await api.put<DefaultSuccessResponse>(ProductApi.path("/edit"), dto)
    return data
  }
  async get() {
    const { data } = await api.get<IProductsResponse>(ProductApi.path("/"))
    return data.products
  }
}

export const productApi = new ProductApi()