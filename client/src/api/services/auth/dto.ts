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

export type EditUserContactDto = Pick<IUser, "displayName">

export type FindUsersDto = {query: string}