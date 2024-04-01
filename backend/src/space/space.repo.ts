import { AppDataSource } from "../core/connection/data-source";
import { Space } from "./space.entity";

export const spaceRepo = AppDataSource.getRepository(Space)

