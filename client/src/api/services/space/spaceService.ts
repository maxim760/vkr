import { api } from "../../host";
import type { Space } from "./types";

class SpaceApi {
  static path(nextPath: string) {
    return "/space" + nextPath
  }
  async select(spaceId: string) {
    const { data } = await api.post(SpaceApi.path("/select"), {spaceId})
    return data
  }
  async addUser(email: string) {
    const { data } = await api.post(SpaceApi.path("/add-user"), {email})
    return data
  }
  async getAll() {
    const { data } = await api.get<{spaces: Space[]}>(SpaceApi.path("/all"))
    return data.spaces || [];
  }
  async permissions(dto: {targetUserId: string, canUserEdit: boolean}) {
    const { data } = await api.put(SpaceApi.path(`/permissions`), dto)
    return data
  }
}

export const spaceApi = new SpaceApi()