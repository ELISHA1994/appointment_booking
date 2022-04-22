import {Request, Response} from "express";
import AppDataSource from "../data-source";
import bcryptjs from 'bcryptjs';
import {asyncHandler} from "../middleware/error.middleware";
import {User} from "../entity/user.entity";
import {Token} from "../entity/token.entity";
import {sign} from "jsonwebtoken";

export const Register = asyncHandler(async (req: Request, res: Response) => {
    const {password, password_confirm, ...body} = req.body;

    if (password !== password_confirm) {
        return res.status(400).json({
            status: 400,
            message: "Password and password confirm do not match!"
        })
    }

    const user = await AppDataSource.getRepository(User).save({
        ...body,
        password: await bcryptjs.hash(password, 10)
    });

    delete user.password;

    res.status(201).json(user);
})

export const Login = asyncHandler(async (req: Request, res: Response) => {
    const user = await AppDataSource.getRepository(User).findOne({
        where: {
            email: req.body.email
        },
        select: ["id", "password"]
    });

    if (!user) {
        return res.status(400).json({
            message: 'invalid credentials!'
        });
    }

    if (!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).json({
            message: 'invalid credentials!'
        });
    }

    const jwt = sign({
        id: user.id,
    }, process.env.SECRET_KEY);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await AppDataSource.getRepository(Token).save({
        user_id: user.id,
        token: jwt,
        expired_at: tomorrow
    });

    res.cookie("jwt", jwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000//1 day
    })

    res.status(200).json({
        message: 'success'
    });
})

export const AuthenticatedUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req["user"];
    res.status(200).json(user);
})

export const Logout = asyncHandler(async (req: Request, res: Response) => {
    const user = req["user"];
    await AppDataSource.getRepository(Token).delete({
        user_id: user.id
    });

    res.cookie("jwt", "", {maxAge: 0});

    res.json({
        message: 'success'
    });
})

export const UpdateInfo = asyncHandler(async (req: Request, res: Response) => {
    const user = req["user"];

    const repository = AppDataSource.getRepository(User);

    await repository.update(user.id, req.body);

    res.send(await repository.findOne(user.id));
})

export const UpdatePassword = asyncHandler(async (req: Request, res: Response) => {
    const user = req["user"];

    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({
            message: "Password's do not match!"
        })
    }

    await AppDataSource.getRepository(User).update(user.id, {
        password: await bcryptjs.hash(req.body.password, 10)
    });

    res.send(user);
})

