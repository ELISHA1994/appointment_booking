import { DataSource } from "typeorm";

let AppDataSource

if (process.env.NODE_ENV === "production") {
    AppDataSource = new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [
            "src/entity/*.ts"
        ]
    });
} else {
    AppDataSource = new DataSource({
        type: "mysql",
        host: "appointment_db",
        port: 3306,
        username: "root",
        password: "root",
        database: "appointments",
        synchronize: true,
        logging: false,
        entities: [
            "src/entity/*.ts"
        ]
    });
}

export default AppDataSource;
