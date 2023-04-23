import { AxiosRequestConfig } from "axios";
import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { IAddress, IAddressResponse } from "src/api/types/models/Address";
import { IUser } from "src/api/types/models/User";
import { AuthResponse } from "src/api/types/response/AuthResponse";
import { EditUserBalanceDto, EditUserContactDto, LoginUserDto, RegisterUserDto } from "./dto";
import { IUserLoginResponse, IUserRegisterResponse } from "./response";


class AuthApi {
  async register(dto: RegisterUserDto) {
    const { data } = await api.post<IUserRegisterResponse>("/auth/registration", dto)
    return data
  }
  async registerOauth2(dto: RegisterUserDto) {
    const { data } = await api.post<IUserLoginResponse>("/auth/registration/oauth2", dto)
    return data
  }
  async login(dto: LoginUserDto) {
    const { data } = await api.post<IUserLoginResponse>("/auth/login", dto)
    return data
  }
  async me() {
    const { data } = await api.get<IUser>("/auth/me")
    return data
  }
  async refresh() {
    const { data } = await api.get<AuthResponse>("/auth/refresh", {_isRetry: true} as AxiosRequestConfig)
    return data
  }
  async logout() {
    await api.post("/auth/logout")
  }
  async editAddress(dto: IAddress) {
    const { data } = await api.put<DefaultSuccessResponse>("/auth/address", dto)
    return data
  }
  async editContact(dto: EditUserContactDto) {
    const { data } = await api.put<DefaultSuccessResponse>("/auth/contact", dto)
    return data
  }
  async editBalance(dto: EditUserBalanceDto) {
    const { data } = await api.put<DefaultSuccessResponse>("/auth/cash", dto)
    return data
  }
  async deleteAccount() {
    const { data } = await api.delete<DefaultSuccessResponse>("/auth")
    return data
  }

}

export const authApi = new AuthApi()