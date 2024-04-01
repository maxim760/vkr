import type { IUser } from "../../types/models/User"

export type RegisterUserDto = {
  user: {
    email: string,
    displayName: string,
    password: string,
  },
}

export type LoginUserDto = {
  email: string,
  password: string
}

export type EditUserContactDto = Pick<IUser, "firstName" | "lastName" | "phone">

export type EditUserBalanceDto = Pick<IUser, "cash">

export type FindUsersDto = {query: string}