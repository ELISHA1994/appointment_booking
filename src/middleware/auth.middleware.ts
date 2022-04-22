import {Request, Response} from "express";
import {verify} from "jsonwebtoken";
import {MoreThanOrEqual} from "typeorm";
import {User} from "../entity/user.entity";
import {Token} from "../entity/token.entity";
import AppDataSource from "../data-source";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt'];

        const payload: any = verify(jwt, process.env.SECRET_KEY);

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        const user = await AppDataSource.getRepository(User).findOne({
            where: {
                id: payload.id
            }
        });

        const userToken = await AppDataSource.getRepository(Token).findOne(
            {
                where: {
                    user_id: user.id,
                    expired_at: MoreThanOrEqual(new Date())
                }
            }
        );

        if (!userToken) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        req["user"] = user;

        next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
