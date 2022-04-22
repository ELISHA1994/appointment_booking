import {Request, Response} from "express";

export const Handle404Error = (request: Request, response: Response) => {
    response.status(404).send({error: "resource not found"});
};

export const BasicErrorHandler = (error: Error, request: Request, response: Response, next: Function) => {
    const statusCode = response.statusCode ? response.statusCode : 500;
    response.status(statusCode).send({
        status: statusCode,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack
    });
};
