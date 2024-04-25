import {Event} from "../events/event.entity";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {registerAs} from "@nestjs/config";
import {Attendee} from "../events/attendee.entity";
import {Teacher} from "../school/teacher.entity";
import {Subject} from "../school/subject.entity";
import {User} from "../auth/user.entity";
import {Profile} from "../auth/profile.entity";

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Event, Attendee, Teacher, Subject,User,Profile],
        synchronize: true
    })
);