import { api } from "../../host";
import type { Folder } from "./types";

class FolderApi {
  static path(nextPath: string) {
    return "/folder" + nextPath
  }
  async create(dto: Partial<Folder>) {
    const { data } = await api.post<Folder>(FolderApi.path("/create"), dto)
    return data;
  }
  async delete(id: string) {
    const { data } = await api.delete<Folder>(FolderApi.path("/" + id))
    return data
  }
  async rename(dto: Partial<Folder>) {
    const { data } = await api.put<Folder>(FolderApi.path("/rename"), dto)
    return data
  }
}

export const folderApi = new FolderApi()