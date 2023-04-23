import { UserRole } from "../types";
import {NextFunction, Response, Request} from "express"
export const requireRole = (roleData: UserRole[] | UserRole) => {
  const roles = Array.isArray(roleData) ? roleData : [roleData]
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
      next()
    }
    if (req.user?.roles) {
      const hasRole = req.user.roles.some((role: UserRole) => roles.includes(role))
      if (hasRole) {
        next()
      }
    }
    res.status(403).send({ message: "Доступ запрещен" });
  }
}