import { AppDataSource } from "../core/connection/data-source";
import { Folder } from "./folder.entity";

export const folderRepo = AppDataSource.getRepository(Folder)

