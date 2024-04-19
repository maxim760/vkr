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
  console.log("cookie extractor")
  let token = null;
  console.log("token: ", token , "!", req.cookies)
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  console.log("token: ", token , "!")
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
    console.log("refresh 0")
    const user = await userRepo.findOne({ where: { id } })
    const refreshToken = user?.refreshToken
    console.log("refresh 1")
    if (refreshToken) {
      // Проверяем валидность refresh-токена
      try {
        console.log("refresh 2")
        const payload: IUserPayload = { id, email: user.email };
        const newTokens = TokenService.generateTokens(payload)
        user.refreshToken = newTokens.refreshToken
        await userRepo.save(user)
        console.log("refresh 3")
        done(null, {tokens: newTokens, user});
        console.log("refresh 4")
      } catch (err) {
        console.log("refresh 5")
        done(null, false);
      }
    } else {
      console.log("refresh 6")
      done(null, false);
    }
  }))
  passport.use("jwt", new JWTStrategy(jwtAccessOptions, (payload, done) => {
    console.log("jwt", payload)
    done(null, payload)
  }))
}

export default applyJwtStrategy