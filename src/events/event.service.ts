import {Injectable, Logger} from "@nestjs/common";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AttendeeAnswerEnum} from "../enums/attendee.answer.enum";
import {ListEvents, WhenEventFilter} from "./input/list.evnts";
import {addDays, endOfDay, endOfWeek, startOfDay, startOfWeek} from "date-fns";
import {paginate, PaginationOptions, PaginationResult} from "./pagination/paginator";

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name)

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) {
    }

    private getEventBaseQuery() {
        return this.eventRepository.createQueryBuilder('event')
            .orderBy('event.id', 'DESC');
    }

    public getEventWithAttendeesCountQuery() {
        return this.getEventBaseQuery().loadRelationCountAndMap('event.attendeeCount', 'event.attendees')
            .loadRelationCountAndMap(
                'event.attendeeAccepted',
                'event.attendees',
                'attendee',
                (qb) =>
                    qb.where(
                        'attendee.answer = :answer',
                        {answer: AttendeeAnswerEnum.ACCEPTED}
                    )
            )

            .loadRelationCountAndMap(
                'event.attendeeAccepted',
                'event.attendees',
                'attendee',
                (qb) =>
                    qb.where(
                        'attendee.answer = :answer',
                        {answer: AttendeeAnswerEnum.ACCEPTED}
                    )
            )
    }


    public async getEvent(id: number): Promise<Event> {
        const query = this.getEventBaseQuery().andWhere('event.id = :id', {id});
        this.logger.debug(await query.getSql());
        return await query.getOne();
    }


    public async getEventWithAttendees(id: number): Promise<Event> {
        const query = this.getEventBaseQuery().andWhere('event.id = :id', {id}).leftJoinAndSelect('event.attendees', 'attendees');
        this.logger.debug(await query.getSql());
        return await query.getOne();
    }

    public async getEvents(): Promise<Event[]> {
        const query = (await (this.getEventWithAttendeesCountQuery())).leftJoinAndSelect('event.attendees', 'attendees');
        return await query.getMany();
    }

    public async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
        let query = this.getEventWithAttendeesCountQuery()
        console.log(filter)
        if (filter && filter.when) {
            const filterWhenNumber = parseInt(filter.when.toString(), 10);
            if (filter.when == WhenEventFilter.Today) {
                const todayStart = startOfDay(new Date());
                const todayEnd = endOfDay(new Date());
                query = query.andWhere('event.when >= :start AND event.when <= :end', {
                    start: todayStart,
                    end: todayEnd
                });
            }
            if (filter.when == WhenEventFilter.Tomorrow) {
                const tomorrowStart = startOfDay(addDays(new Date(), 1));
                const tomorrowEnd = endOfDay(addDays(new Date(), 1));

                query = query.andWhere('event.when >= :start AND event.when <= :end', {
                    start: tomorrowStart,
                    end: tomorrowEnd
                });
            }


            if (filter.when == WhenEventFilter.ThisWeek) {
                const thisWeekStart = startOfWeek(new Date());
                const thisWeekEnd = endOfWeek(new Date());
                query = query.andWhere('event.when >= :start AND event.when <= :end', {
                    start: thisWeekStart,
                    end: thisWeekEnd
                });
            }
        }

        return await query.getMany();
    }

    private generateQuery(filter?: ListEvents) {
        let query = this.getEventWithAttendeesCountQuery();

        if (filter && filter.when) {
            if (filter.when == WhenEventFilter.Today) {
                const todayStart = startOfDay(new Date());
                const todayEnd = endOfDay(new Date());
                query = query.andWhere('event.when >= :start AND event.when <= : end', {
                    start: todayStart,
                    end: todayEnd
                })
            }
        }

        return query;
    }

    public async getEventsWithPagination(filter?: ListEvents, options?: PaginationOptions) {
        return await paginate(
            this.generateQuery(filter),
            options
        )
    }


    public async deleteEvent (id:number){
        return await this.eventRepository
            .createQueryBuilder('event')
            .delete()
            .where('id=:id',{id})
            .execute() ;
    }


}