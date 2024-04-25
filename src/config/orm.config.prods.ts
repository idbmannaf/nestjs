import {Event} from "../events/event.entity";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {registerAs} from "@nestjs/config";

export default registerAs(
    'orm.config.prods',
    (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Event],
        synchronize: false
    })
);