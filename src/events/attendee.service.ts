import {Repository} from "typeorm";
import {Attendee} from "./attendee.entity";
import {InjectRepository} from "@nestjs/typeorm";

export class AttendeeService {
    constructor(@InjectRepository(Event) private readonly repository: Repository<Attendee>) {
    }

    async deleteAttendeesByEventId(event_id: number) {
        return await this.repository.createQueryBuilder('attendee')
            .delete()
            .where('attendee.event_id = :event_id', {event_id: 1})
            .execute();
    }
}