import { NextFunction, Request, Response } from "express";
import { ITokens, IUserPayload, TypedRequestBody, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { Certificate } from "./certificate.entity";
import { certificateRepo } from "./certificate.repo";
import { CreateCertificateDto } from "./dto/create-certificate.dto";

class CertificateController {
  async getCertificates(req: Request, res: Response) {
    if (!req.user?.id) {
      return res.status(403).json({data: null, message: "Нет доступа"})
    }
    const received = await certificateRepo.findBy({toUser: req.user.id})
    const donated = await certificateRepo.findBy({ fromUser: req.user.id })
    return {
      received,
      donated
    }
  }
  async addCertificate(req: TypedRequestBody<CreateCertificateDto>, res: Response) {
    const id = req.user?.id
    const {fromUser, toUser, price} = req.body
    if (id !== req.body.fromUser) {
      return res.status(403).json({data: null, message: "Нет доступа"})
    }
    if (price <= 0) {
      return res.status(400).json({data: null, message: "Сумма должна быть больше 0"})
    }
    const certificate = new Certificate();
    certificate.price = price
    certificate.fromUser = {id: fromUser} as User
    certificate.toUser = { id: toUser } as User
    const result = await certificateRepo.save(certificate)
    return res.json(result)
  }
}
export default new CertificateController