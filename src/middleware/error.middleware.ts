import {Request, Response} from "express";


export const asyncHandler = fn =>
    function asyncUtilWrap(...args) {
        const fnReturn = fn(...args)
        const next = args[args.length-1]
        return Promise.resolve(fnReturn).catch(next)
    }

export const Handle404Error = (request: Request, response: Response) => {
    response.status(404).send({error: "resource not found"});
};

export const BasicErrorHandler = (error: Error, request: Request, response: Response, next: Function) => {

    response.status(500).json({
        status: 500,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack
    });
};
