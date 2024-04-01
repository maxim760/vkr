import { Response } from "express"
import { TokenService } from "../core/utils/tokens"
import { User } from "../user/user.entity"
import { userRepo } from "../user/user.repo"
import { IAfterLoginData } from "./auth.types"

class AuthService {
  async findByEmail(email: string) {
    if (!email) {
      return null;
    }

    const result = await userRepo.findOne({ where: { email }, relations: { userSpaces: { space: true, user: true } } })
    return result
  }

  async findSpaceIdByEmail(email: string) {
    if (!email) return {
      activeSpace: null,
      canEdit: false,
    };

    const user = await this.findByEmail(email);

    if (!user) return {
      activeSpace: null,
      canEdit: false,
    };

    const activeSpace = user.userSpaces.find(userSpace => userSpace.is_selected)?.space || null
    const spacesCanEdit = user.userSpaces.filter(item => item.is_edit).map(item => item.space.id)
    const spacesAdmin = user.userSpaces.filter(item => item.is_admin).map(item => item.space.id)

    return {
      activeSpace: activeSpace,
      canEdit: activeSpace ? spacesCanEdit.includes(activeSpace?.id) : false,
      isAdmin: activeSpace ? spacesAdmin.includes(activeSpace?.id) : false,
    };
  }

  async loginAfterOauth(user: Partial<User>): Promise<IAfterLoginData> {
    if (!user.email) {
      return {finded: false, user}
    }
    const candidate = await this.findByEmail(user.email)
    if (!candidate) {
      return {finded: false, user}
    }
    const newTokens = TokenService.generateTokens({ email: candidate.email, id: candidate.id })
    candidate.refreshToken = newTokens.refreshToken
    await userRepo.save(candidate)
    return {
      finded: true,
      user: candidate,
      tokens: newTokens,
    }
  }

  returnProfileFields(user: User) {
    const { password, refreshToken, ...other } = user
    return other
  }
}

export default new AuthService()