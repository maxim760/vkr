import { Router } from "express";
import passport from "passport";
import spaceController from "./space.controller";

const spaceRouter = Router()

spaceRouter.post("/select", passport.authenticate('jwt', { session: false }), spaceController.setSelectedSpace)
spaceRouter.post("/add-user", passport.authenticate('jwt', { session: false }), spaceController.addUserByEmail)
spaceRouter.get("/all", passport.authenticate('jwt', { session: false }), spaceController.getAll)
spaceRouter.put("/permissions", passport.authenticate('jwt', { session: false }), spaceController.updateUserPermissions)

export {spaceRouter}
