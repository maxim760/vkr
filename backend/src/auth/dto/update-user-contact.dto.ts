import { User } from "../../user/user.entity";

export type UpdateUserContantDto = Pick<User, "displayName">