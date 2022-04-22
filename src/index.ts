import express from 'express';
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";
import {default as logger} from "morgan";
import { createStream } from "rotating-file-stream";
// import { default as DBG } from 'debug';
import AppDataSource from "./data-source";
import {BasicErrorHandler, Handle404Error} from "./middleware/error.middleware";

dotenv.config();

AppDataSource.initialize()
    .then(async () => {
        const app = express();

        app.use(express.json());
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cors({
            credentials: true,
            origin: ['*']
        }));
        app.use(logger('dev'));


        app.use(Handle404Error);
        app.use(BasicErrorHandler);

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server started on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
