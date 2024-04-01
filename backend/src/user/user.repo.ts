import { AppDataSource } from "../core/connection/data-source";
import { UserSpaces } from "./user-space.entity";
import { User } from "./user.entity";

export const userRepo = AppDataSource.getRepository(User)

export const userSpacesRepo = AppDataSource.getRepository(UserSpaces)