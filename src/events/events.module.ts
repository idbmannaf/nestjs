import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Event} from "./event.entity";
import {EventController} from "./event.controller";
import {Attendee} from "./attendee.entity";
import {EventService} from "./event.service";
import {AttendeeService} from "./attendee.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event,Attendee]),
    ],
    controllers: [EventController],
    providers:[EventService,AttendeeService]
})
export class EventsModule { }