import { NextFunction, Request, Response } from "express";
import { ITokens, IUserPayload, TypedRequestBody, TypedRequestQuery } from "../core/types";
import { User } from "../user/user.entity";
import { userRepo, userSpacesRepo } from "../user/user.repo";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt"
import {Like, Raw, ILike} from "typeorm"
import { LoginUserDto } from "./dto/login-user.dto";
import passport from "passport";
import { TokenService } from "../core/utils/tokens";
import { UpdateUserContantDto } from "./dto/update-user-contact.dto";
import { FindUsersDto } from "./dto/find-users-dto";
import cookie from "cookie"
import { Space } from "../space/space.entity";
import authService from "./auth.service";
import { spaceRepo } from "../space/space.repo";
import { UserSpaces } from "../user/user-space.entity";

class AuthController {
  async registration(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      const { user: { password, ...userData } } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      const user = userRepo.create(userData)

      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      await userRepo.save(user)

      const space = new Space();
      space.name = `${userData.displayName} Пространство`;
      await spaceRepo.save(space);

      const userSpace = new UserSpaces();
      userSpace.user = user;
      userSpace.space = space;
      userSpace.is_edit = true; // Пользователь по умолчанию имеет права на редактирование
      userSpace.is_admin = true; // Пользователь по умолчанию является администратором
      userSpace.is_selected = true; // Пространство становится основным для пользователя
      await userSpacesRepo.save(userSpace);
    
      return res.json({ user: {email: user.email} });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }
  async registrationOauth2(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      console.log("reg start")
      const { user: { password, ...userData } } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      console.log("reg start 2")
      const user = userRepo.create(userData)
      
      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      await userRepo.save(user)

      const payload: IUserPayload = { id: user.id, email: user.email };
      const newTokens = TokenService.generateTokens(payload)
      user.refreshToken = newTokens.refreshToken
      await userRepo.save(user)

      const space = new Space();
      space.name = `${userData.displayName} Пространство`;
      await spaceRepo.save(space);

      const userSpace = new UserSpaces();
      userSpace.user = user;
      userSpace.space = space;
      userSpace.is_edit = true; // Пользователь по умолчанию имеет права на редактирование
      userSpace.is_admin = true; // Пользователь по умолчанию является администратором
      userSpace.is_selected = true; // Пространство становится основным для пользователя
      await userSpacesRepo.save(userSpace);

      console.log("set new cookie", newTokens.refreshToken)
      res.setHeader("Set-Cookie", cookie.serialize("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
      }))
      return res.json({ user: user.toJSON() });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }

  async login(req: TypedRequestBody<LoginUserDto>, res: Response, next: NextFunction) {
    try {
      passport.authenticate('local', async (err, user: User, info) => {
        console.log()
        if (err || !user) {
          return res.status(401).json({ message: 'Неправильные email или пароль.', login: true });
        }
        const payload: IUserPayload = { id: user.id, email: user.email };
        const newTokens = TokenService.generateTokens(payload)
        user.refreshToken = newTokens.refreshToken
        await userRepo.save(user)
        console.log("set new cookie login", newTokens.refreshToken)
        res.setHeader("Set-Cookie", cookie.serialize("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/'
        }))
        return res.json({ user: user.toJSON(), accessToken: newTokens.accessToken });
      })(req, res, next);
    } catch (e) {
      console.log("catch login")
      return res.status(500).json({message: "Ошибка авторизации"})
    }

  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken", {
        sameSite: 'none',
        secure: true,
      });
      console.log(req?.user?.id)
      const user = await userRepo.findOneBy({ id: req.user?.id || "" })
      if (user) {
        user.refreshToken = ""
        await userRepo.save(user)
      }
      res.json({success: true})
    } catch (e) {
      next(e)
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.user as { tokens: ITokens, user: User }
      res.json({user: data?.user?.toJSON?.(), accessToken: data.tokens.accessToken})
    } catch (e) {
      next(e)
    }
  }

  async oauthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      if ((req.user as any)?.tokens) {
        console.log("set cookies")
        console.log("set new cookie", (req.user as any).tokens.refreshToken)
        res.setHeader("Set-Cookie", cookie.serialize("refreshToken", (req.user as any).tokens.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/'
        }))
      }
      
      res.send(`
        <script>
          window.opener.postMessage(${JSON.stringify({ user: {...req.user, accessToken: req.user?.tokens?.accessToken || "", tokens: null }, type: "oauth2" })}, '*');
          window.close();
        </script>
      `);
    } catch (e) {
      next(e)
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({data: null})
      }
      const user = await userRepo.findOne({ where: { email: req.user.email }, relations: { userSpaces: { space: true }  } })
      if (!user) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      res.json(user.toJSON())
    } catch (error) {
      next(error)
    }
  }

  async updateUserContact(req: TypedRequestBody<UpdateUserContantDto>, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id
      const user = await userRepo.findOne({ where: { id }})
      if (!user) {
        res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }

      const {activeSpace, canEdit, isAdmin} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit || !isAdmin) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      await userRepo.update({ id }, req.body)

      activeSpace.name = `${req.body.displayName} Пространство`;

      await spaceRepo.save(activeSpace);

      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }

}
export default new AuthController