import express from 'express';
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";
import {default as logger} from "morgan";
import AppDataSource from "./data-source";
import cron from "node-cron";

import {GetReminders} from "./controller/appointment.controller";
import {BasicErrorHandler, Handle404Error} from "./middleware/error.middleware";
import { routes } from './routes';
import {sendEmail} from "./middleware/email.middleware";

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

        routes(app);

        app.use(Handle404Error);
        app.use(BasicErrorHandler);

        // cron job which sends email reminders every REMINDER_SCHEDULE_MIN minutes
        cron.schedule(
            `* ${process.env.REMINDER_SCHEDULE_MIN}  * * *`,
            async () => {
                const reminderList = await GetReminders();
                reminderList.map((reminder) => sendEmail(reminder));
            }
        );

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server started on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
