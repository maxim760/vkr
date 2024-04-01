export enum RoleTypes {
  Admin = "admin",
  User = "user"
}

export type IUser = {
  id: string,
  email: string,
  displayName: string,
}