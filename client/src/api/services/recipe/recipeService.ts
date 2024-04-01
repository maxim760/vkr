import { api } from "../../host";
import type { FolderRecipe, Recipe } from "./types";

class RecipeApi {
  static path(nextPath: string) {
    return "/recipe" + nextPath
  }
  async createLink(link: string) {
    const { data } = await api.post<Recipe>(RecipeApi.path("/create-link"), {link})
    return data
  }
  async create(dto: Partial<Recipe>) {
    const { data } = await api.post<Recipe>(RecipeApi.path("/create"), dto)
    return data
  }
  async update(id: string, dto: { name?: string, description?: string, folderId: string | null }) {
    const { data } = await api.put<Recipe>(RecipeApi.path("/update/" + id), dto)
    return data
  }
  async getOne(id: string) {
    const { data } = await api.get<{ data: Recipe }>(RecipeApi.path(`/one/${id}`))
    return data
  }
  async search(query: string) {
    const { data } = await api.get<{ data: Recipe[] }>(RecipeApi.path(`/search?keyword=${query}`))
    return data
  }
  async folders(query: string) {
    const { data } = await api.get<{data: FolderRecipe[]}>(RecipeApi.path(`/folders`))
    return {
      ...data,
      data: data.data,
    }
  }
}

export const recipeApi = new RecipeApi()