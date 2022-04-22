import {Request, Response} from "express";
import AppDataSource from "../data-source";
import {asyncHandler} from "../middleware/error.middleware";
import {Appointment} from "../entity/appointment.entity";
import {User} from "../entity/user.entity";

export const CreateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { title, start, end } = req.body;

    if (!title || !start || !end) {
        return res.status(400).json({
            message: "Please make sure you added a valid date and description"
        });
    }

    const user = req["user"];

    const appointment = await AppDataSource.getRepository(Appointment).save({
        title,
        start,
        end,
        user: user.id,
        status: 'open'
    })

    res.status(201).json(appointment)
});

export const GetUserAppointment = asyncHandler(async (req: Request, res: Response) => {
    const user = req["user"];

    const appointments = await AppDataSource.getRepository(Appointment).find({
        where: {
            user: user.id
        }
    });

    res.status(200).json(appointments)
});

export const GetAppointment = asyncHandler(async (req: Request, res: Response) => {
    const appointment = await AppDataSource.getRepository(Appointment).findOne({
        where: {
            id: req.params.id
        }
    });

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    res.status(200).json(appointment)
});

export const UpdateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const appointment = await AppDataSource.getRepository(Appointment).findOne({
        where: {
            id: req.params.id
        }
    });

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    if (appointment.user.toString() !== req["user"].id && req["user"].is_admin) {
        return res.status(403).json({
            message: "You are not authorized to update this appointment"
        });
    }

    const { title, start, end } = req.body;

    if (!title || !start || !end) {
        return res.status(400).json({
            message: "Please make sure you added a valid date and description"
        });
    }

    appointment.title = title;
    appointment.start = start;
    appointment.end = end;

    const updatedAppointment = await AppDataSource.getRepository(Appointment).save(appointment);

    res.status(200).json(updatedAppointment)
});

export const GetReminders =  asyncHandler(async () => {
    const appointments = await AppDataSource.getRepository(Appointment).find({
        where: {
            status: 'open'
        }
    });

    const reminderDate = new Date();
    reminderDate.setMinutes(reminderDate.getMinutes() + 15);

    const filteredAppointments = appointments.filter(
        (a) => new Date(a.start) > new Date() && reminderDate >= new Date(a.start)
    );

    const reminderList = filteredAppointments.map(async (fa) => {
        const user = await AppDataSource.getRepository(User).findOne({
            where: {
                id: fa.user
            }
        })
        const email = user.email;

        return {
            from: process.env.EMAIL_SERVICE_USER,
            to: email,
            subject: fa.title,
            text: `Start: ${fa.start} End: ${fa.end}`,
        };
    });

    return await Promise.all(reminderList);
});
