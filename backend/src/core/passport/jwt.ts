import { PassportStatic } from "passport";
import dotenv from "dotenv"
import { Strategy as JWTStrategy, StrategyOptions as JWTStrategyOptions, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { TokenService } from "../utils/tokens";
import { Request } from "express";
import { IUserPayload } from "../types";
import { userRepo } from "../../user/user.repo";
dotenv.config()

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  return token;
};



const jwtRefreshOptions: JWTStrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};
const jwtAccessOptions: JWTStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const applyJwtStrategy = (passport: PassportStatic) => {
  passport.use("jwt-refresh", new JWTStrategy(jwtRefreshOptions, async (payload: IUserPayload, done) => {
    const { id, email } = payload
    const user = await userRepo.findOne({ where: { id }, relations: { roles: true } })
    const refreshToken = user?.refreshToken
    if (refreshToken) {
      // Проверяем валидность refresh-токена
      try {
        const payload: IUserPayload = { id, email: user.email, roles: user.roles.map(item => item.name) };
        const newTokens = TokenService.generateTokens(payload)
        user.refreshToken = newTokens.refreshToken
        await userRepo.save(user)
        done(null, {tokens: newTokens, user});
      } catch (err) {
        done(err);
      }
    } else {
      done(new Error('Refresh token not found'));
    }
  }))
  passport.use("jwt", new JWTStrategy(jwtAccessOptions, (payload, done) => {
    done(null, payload)
  }))
}

export default applyJwtStrategy