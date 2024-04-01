import { Router } from "express";
import passport from "passport";
import authController from "./auth.controller";

const authRouter = Router()

authRouter.post("/registration", authController.registration)
authRouter.post("/registration/oauth2", authController.registrationOauth2)
authRouter.post("/login", authController.login)
authRouter.post("/logout", passport.authenticate('jwt', { session: false }), authController.logout)
authRouter.get("/refresh", passport.authenticate('jwt-refresh', { session: false }), authController.refresh)
authRouter.get("/me", passport.authenticate('jwt', { session: false }), authController.me)
authRouter.get("/yandex", passport.authenticate('yandex', {session: false}))
authRouter.get("/yandex/callback", passport.authenticate("yandex" as any, {display: "popup", session: false}), authController.oauthCallback)
authRouter.get("/vk", passport.authenticate('vkontakte', {scope: ["email"], session: false}))
authRouter.get("/vk/callback", passport.authenticate("vkontakte" as any, {display: "popup", session: false}), authController.oauthCallback)
authRouter.get("/slack", passport.authenticate('slack', {session: false}))
authRouter.get("/slack/callback", passport.authenticate("slack" as any, {display: "popup", session: false}), authController.oauthCallback)
authRouter.get("/google", passport.authenticate('google', { session: false}))
authRouter.get("/google/callback", passport.authenticate("google", {display: "popup", session: false}), authController.oauthCallback)
authRouter.get("/github", passport.authenticate('github', { session: false, scope: ["user"]}))
authRouter.get("/github/callback", passport.authenticate("github" as any, { display: "popup", session: false }), authController.oauthCallback)

authRouter.put("/contact", passport.authenticate('jwt', { session: false }), authController.updateUserContact)

export {authRouter}
