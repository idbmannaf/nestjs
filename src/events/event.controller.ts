/*
https://docs.nestjs.com/controllers#controllers
*/

import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
    Delete,
    ParseIntPipe,
    ValidationPipe,
    Logger,
    NotFoundException, Query, UsePipes
} from '@nestjs/common';
import {Event} from './event.entity';
import {CreateEventDto} from './input/create-event.dto'
import {LessThan, LessThanOrEqual, Like, MoreThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Attendee} from "./attendee.entity";
import {EventService} from "./event.service";
import {ListEvents, WhenEventFilter} from "./input/list.evnts";
import {AttendeeService} from "./attendee.service";

@Controller('/events')
export class EventController {
    public events: Event[] = [];
    private readonly logger = new Logger(EventController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventService: EventService,
        private attendeeService: AttendeeService
    ) {
    }

    @Get()
    async findAll() {
        const events = await this.eventService.getEvents();
        if (!events.length) {
            throw new NotFoundException()
        }
        return events;
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe) id) {

        // const event=  this.eventService.getEvent(id);
        const event = this.eventService.getEventWithAttendees(id);
        if (!event) {
            throw new NotFoundException();
        }
        return event;
    }

    @Post()
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save(({
            ...input,
            when: new Date()
        }))
    }

    @Patch(':id')
    async update(@Body() input: CreateEventDto, @Param('id') id) {
        const event = await this.repository.findOneBy({id: id});
        return await this.repository.save(
            {
                ...event,
                ...input,
                when: new Date(input.when)

            }
        )
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const event = await this.repository.findOneBy({id: id});
        return await this.repository.remove(event);


    }


    @Get('practice/typeorm')
    async practice() {
        // https://typeorm.io/find-options#advanced-options

        // Id Less Then 10

        // const events = this.repository.findBy({
        //     id:LessThan(10)
        // })


        // Id Less Then Or Equal to 3
        const events = await this.repository.find({
            select: ['id', 'when'],
            where: [{
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            }, {
                address: Like('%meet%')
            }],
            take: 2,
            order: {
                id: 'DESC'
            }
        });


        return events;
    }

    @Get('practice/related-entities')
    async practice2() {
        const event = await this.repository.find({where: {id: 1}, relations: ['attendees']});
        return event;
    }

    @Get('practice/form-attendee-with-event')
    async attendeePractice() {
        const attendee = await this.attendeeRepository.find({where: {id: 1}, relations: ['event']});
        return attendee;
    }

    @Get('/filter-events/filter')
    @UsePipes(new ValidationPipe({transform: true}))
    async filterEvents(@Query() filter: ListEvents) {
        // const events = await this.eventService.getEventsWithAttendeeCountFiltered(filter);

        const events = await this.eventService.getEventsWithPagination(
            filter,
            {
                total: 1,
                limit: filter.limit,
                currentPage: filter.page,
            }
        )

        return events;

    }

}
