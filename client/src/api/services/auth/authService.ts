import type { AxiosRequestConfig } from "axios";
import type { IUser } from "src/api/types/models/User";
import { api } from "../../host";
import type { DefaultSuccessResponse } from "../../types/common";
import type { AuthResponse } from "../../types/response/AuthResponse";
import type { LoginUserDto, RegisterUserDto } from "./dto";
import type { IBalanceRes, IUserLoginResponse, IUserRegisterResponse } from "./response";

class AuthApi {
  static path(nextPath: string) {
    return "/auth" + nextPath
  }
  async register(dto: RegisterUserDto) {
    const { data } = await api.post<IUserRegisterResponse>(AuthApi.path("/registration"), dto)
    return data
  }
  async registerOauth2(dto: RegisterUserDto) {
    const { data } = await api.post<IUserLoginResponse>(AuthApi.path("/registration/oauth2"), dto)
    return data
  }
  async login(dto: LoginUserDto) {
    const { data } = await api.post<IUserLoginResponse>(AuthApi.path("/login"), dto)
    return data
  }
  async me() {
    const { data } = await api.get<IUser>(AuthApi.path("/me"))
    return data
  }
  async getBalance() {
    const { data } = await api.get<IBalanceRes>(AuthApi.path("/balance"))
    return data
  }
  async refresh() {
    const { data } = await api.get<AuthResponse>(AuthApi.path("/refresh"), {_isRetry: true} as AxiosRequestConfig)
    return data
  }
  async logout() {
    await api.post(AuthApi.path("/logout"))
  }
  async editContact(displayName: string) {
    const { data } = await api.put<DefaultSuccessResponse>(AuthApi.path("/contact"), { displayName })
    return data
  }
}

export const authApi = new AuthApi()