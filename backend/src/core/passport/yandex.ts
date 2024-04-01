import { PassportStatic } from "passport";
import dotenv from "dotenv"
import { Strategy as YandexStrategy, } from 'passport-yandex';
import { User } from "../../user/user.entity";
import authService from "../../auth/auth.service";
dotenv.config()

const applyYandexStrategy = (passport: PassportStatic) => {
  passport.use(new YandexStrategy({
    clientID: process.env.YA_CLIENT_ID,
    clientSecret: process.env.YA_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/yandex/callback`,
    // @ts-ignore
    pkce: true,
    // @ts-ignore
    state: true,
  },
  async function (accessToken: any, refreshToken: any, params: any, profile: any, done: any) {
    const json = profile?._json || {}
    const user: Partial<User> = {
      displayName: `${json?.first_name || ""} ${json?.last_name || ""}`.trim(),
      email: json?.default_email || "",
    }
    const loginData = await authService.loginAfterOauth(user)
    return done(null, loginData);
  } as any));
}

export default applyYandexStrategy
