import { Router } from "express";
import passport from "passport";
import folderController from "./folder.controller";

const folderRouter = Router()

folderRouter.post("/create", passport.authenticate('jwt', { session: false }), folderController.createFolder)
folderRouter.delete("/:id", passport.authenticate('jwt', { session: false }), folderController.deleteFolder)
folderRouter.put("/rename", passport.authenticate('jwt', { session: false }), folderController.renameFolder)

export {folderRouter}
