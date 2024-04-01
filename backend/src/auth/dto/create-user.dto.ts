import { OmitCreateEntity } from "../../core/types";
import { User } from "../../user/user.entity";

export type CreateUserDto = {
  user: OmitCreateEntity<User, "refreshToken" | "cash" | "roles">,
}