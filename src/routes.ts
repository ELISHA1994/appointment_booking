import {Router, Request, Response} from "express";
import {AuthenticatedUser, Login, Logout, Register} from "./controller/user.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {
    CreateAppointment,
    GetAppointment,
    GetUserAppointment,
    UpdateAppointment
} from "./controller/appointment.controller";

export const routes = (router: Router) => {

    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({
            message: "Backend API"
        });
    });

    // User
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/me", AuthMiddleware, AuthenticatedUser);
    router.post("/api/logout", AuthMiddleware, Logout);

    // Appointment
    router.post("/api/appointments", AuthMiddleware, CreateAppointment);
    router.get("/api/appointments", AuthMiddleware, GetUserAppointment);
    router.get("/api/appointments/:id", AuthMiddleware, GetAppointment);
    router.put("/api/appointments/:id", AuthMiddleware, UpdateAppointment);

};
