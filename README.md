<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Validation
1.
```bash
$ npm i --save class-validator class-transformer

```
*How to Use Validation? :*
```bash
In Controller:
    @Body(ValidationPipe)

in DTO:
    @Length(5,10)
    name: string;
NOTE: 
    if you want to use validation is globlally then put below code in main.ts
        app.useGlobalPipes(new ValidationPipe())

if You want to use valiation for specific route then use below (Group) code;
    @Length(5,255, {groups:['create', 'update']})

https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators 
```

## Custom Module
``
 $ nest generate module events
``

## Config / .env


 ```bash
  npm i -- save @nestjs/config
```

1. create a env file under project root then you need to register the root under imports:
    ``` ts
           ConfigModule.forRoot({
               isGlobal:true,
               envFilePath: '.env' //By Default
           }),
    ```
2. Then log console.log(process.env.DB_HOST) in controller


##Custom Config:

1. Create a folder **"config"** under the folder create new file "orm.config.ts"
2. Under the file code is
    ```ts
    import {Event} from "../events/event.entity";
    import {TypeOrmModuleOptions} from "@nestjs/typeorm";
    import {registerAs} from "@nestjs/config";
    
    export default registerAs(
        'orm.config',
        (): TypeOrmModuleOptions => ({
            type: "mysql",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Event],
            synchronize: true
        }))
    ```
3. In the App.ts file:
```tsconfig
import ormConfig from './config/orm.config';
    ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', //By Default
            load: [ormConfig]
        }),
        TypeOrmModule.forRootAsync({
            useFactory: ormConfig
        }),
```




#Logging

1. Go To A controller and declare a variable called **logger**:
    ```ts
     private readonly logger = new Logger(EventController.name);
    ```
2. then log the message in any variable in the **controller**
    ```ts
     private readonly this.logger.debug(`Found ${events.length}`)
    ```
3. if you want to more log level in your application than try this in **main.ts**:
    ```ts
    const app = await NestFactory.create(
            AppModule,
            {
                logger: ["error","debug","warn"]
            }
        );
   ```
   
   
   
   
#Exception Filters:
that means validate your condition and retrrn respnse
Example:

   ```ts
   const event = this.repository.findOneBy({id: id});
               if (!event) {
                   throw new NotFoundException();
               }
   ```
list ot Exception Filters:
```ts
 BadRequestException
       UnauthorizedException
       NotFoundException
       ForbiddenException
       NotAcceptableException
       RequestTimeoutException
       ConflictException
       GoneException
       HttpVersionNotSupportedException
       PayloadTooLargeException
       UnsupportedMediaTypeException
       UnprocessableEntityException
       InternalServerErrorException
       NotImplementedException
       ImATeapotException
       MethodNotAllowedException
       BadGatewayException
       ServiceUnavailableException
       GatewayTimeoutException
       PreconditionFailedException 
```


# Relationship

**1. One To Many Relation**

Table One: events
table Two: attendees

[ an Event has many attendees and an attendees has only one attendees]

**In the Event Entity use @ManyToOne() Decorator<br>**
    ***Argument:*** <br>
    **1.** First argument is a function and return relation type<br>
    **2.** The second type is also a function with one argument of the related type and from this function returns a property of the related entity that will point to the owning site<br>
    **3.** The Third argument is a object of options like nullable,onDelete,onUpdate<br>
                
    
    @ManyToOne(()=> Attendees, (attendee)=> attendee.event,{nullable:false,onDelete:'delete'})
    attendees: Attendees[] // arrendees Ennty Array


**In the Attendee Entity Use @OneToMany() Decorator<br>**
    ***Argument:*** <br>
    **1.** First argument is a function and return relation type<br>
    **2.** The second type is also a function with one argument of the related type and from this function returns a property of the related entity that will point to the owning site<br>
                
                
    @OneToMany(()=> Event, (event)=> event.attendees)
    event: Event // single event

**NOTE1:** when you use @OneToMany() decorator then the other site @ManyToOne() decorator is mandatory
**NOTE3:**if you want to change the name of the relation column name then you can use @JoinColumn() Decorator:

        @JoinColumn({
                name: 'event_id'
        })

#Loading Related Entity 
in controller:

        const event = await this.repository.findBy({id:1});
                return event;
In Entity:
    
         @OneToMany(() => Attendee, (attendee) => attendee.event,{
                eager:true
            })
            attendees: Attendee[]
            
**NOTE 1:** if you don't want to load relation data then in query :
             const event = await this.repository.find({where:{id:1},loadEagerRelations:true});
                     return event;
                     
**NOTE 2:** Another Way to load multiple relations (No need to eager:true in Entity):

     const event = await this.repository.find({where:{id:1},relations:['attendees']});
            return event;




**2. Many To Many:**
A Teacher has many subjects and subject have many teachers. <br>
**@ManyToMany()  ---- Teacher**
    
       @ManyToMany(() => Subject, (subject) => subject.teachers)
         subjects: Subject[];
         
**@ManyToMany()  ---- Subject**
    
        @ManyToMany(
           () => Teacher, (teacher) => teacher.subjects, { cascade: true }
         )
         @JoinTable()
         teachers: Teacher[];


## query with counts 
1. loadRelationCountAndMap()

        #params: table is event and attendee
        1. Map to Properties : event er kon property te value rakha hobe. >> event.attendeeRejected
        2. relation name: relation name ki >> event.attendees
        3. alise name.
        4. query builder: eta ekta function like laravel where(function($q)).
        
a. an event has multiple attendees and attendees able to reject, maybe, acceptted option (in answer field)
    
        #In Entity:
            attendeeAccepted?: number // ?: means this property is optional and not store in database
            attendeeRejected?: number // ?: means this property is optional and not store in database
            attendeeMaybe?: number // ?: means this property is optional and not store in database
            
        #in Service/Controller
           this.repository.loadRelationCountAndMap(
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

#Filtering Data Using Query Builder:
   *How to filter Data
   
**1. Define List:**
    
    
    #list.event.ts
    export class ListEvents {
        when?: WhenEventFilter = WhenEventFilter.All
    }
    
    export enum WhenEventFilter {
        All = 1,
        Today,
        Tomorrow,
        ThisWeek,
        NextWeek,
        ThisMonth,
        NextMonth,
    
    }
**2. Controller**
            
            #event.controller.ts
            @Get('/filter-events/filter')
            async filterEvents(@Query() filter: ListEvents) {
                const events = await this.eventService.getEventsWithAttendeeCountFiltered(filter);
                return events;
            }
   
**3. Service**
        
        #event.service.ts
        public async getEventsWithAttendeeCountFiltered(filter?: ListEvents): Promise<Event[]> {
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
        
                    if (filter.when == WhenEventFilter.NextWeek) {
                        const thisWeekStart = startOfWeek(addWeeks(new Date(), 1));
                        const thisWeekEnd = endOfWeek(addWeeks(new Date(), 7));
                        query = query.andWhere('event.when >= :start AND event.when <= :end', {
                            start: thisWeekStart,
                            end: thisWeekEnd
                        });
                    }
                    if (filter.when == WhenEventFilter.ThisMonth) {
                        const thisMonthStart = startOfMonth(new Date());
                        const thisMonthEnd = endOfMonth(new Date());
                        query = query.andWhere('event.when >= :start AND event.when <= :end', {
                            start: thisMonthStart,
                            end: thisMonthEnd
                        });
                    }
        
                    if (filter.when == WhenEventFilter.NextMonth) {
                        const thisMonthStart = startOfMonth(addMonths(new Date(), 1));
                        const thisMonthEnd = endOfMonth(addMonths(new Date(), 1));
                        query = query.andWhere('event.when >= :start AND event.when <= :end', {
                            start: thisMonthStart,
                            end: thisMonthEnd
                        });
                    }
                }
        
                return (await query).getMany()
            }
   
**4. postman:**

        http://localhost:3000/events/filter-events/filter?when=1


#Pagination:
Using Query Builder:

**1. Prepare pagination function**

        #pagination.ts
        import {SelectQueryBuilder} from "typeorm";
        
        export interface PaginateOptions {
            limit: number;
            currentPage: number;
            total?: number;
        }
        
        export interface PaginateResult<T> {
            first: number;
            last: number;
            total?: number;
            limit?: number
            data: T[];
        }
        
        export async function paginate<T>(
            qb: SelectQueryBuilder<T>,
            options: PaginateOptions = {
                limit: 10,
                currentPage: 1
            }
        ): Promise<PaginateResult<T>> {
            const offset = (options.currentPage - 1) * (options.limit);
            const data = await qb.limit(options.limit).offset(offset).getMany();
            return {
                first: offset + 1,
                last: offset + data.length,
                limit: options.limit,
                total: options.total ? await qb.getCount() : null,
                data
            }
        }

**2. Prepare Controller**

    @Get('/filter-events/filter')
        @UsePipes(new ValidationPipe({transform: true}))
        async filterEvents(@Query() filter: ListEvents) {
            const events = await this.eventService.getEventsWithAttendeeCountFilteredWithPagination(
                filter,
                {
                    total: 1,
                    currentPage: filter.page,
                    limit: 1
                }
            );
            return events;
    
        }
**1. Prepare Service**
        
        #first preperar query
         private prepearQueryBuilderForPagination(filter?: ListEvents) {
                let query = this.getEventWithAttendeesCountQuery()
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
        
                return query;
            }
        
        
        
            #Execute the prepear query
            public async getEventsWithAttendeeCountFilteredWithPagination(filter?: ListEvents, paginateOptions?: PaginateOptions) {
        
                return await paginate(
                    await this.prepearQueryBuilderForPagination(filter),
                    paginateOptions
                )
            }
**1. Prepare Postman**

        http://localhost:3000/events/filter-events/filter?when=1&page=2

        
# One To One :
 relationship
 
    # User Entity:
    @OneToOne(() => Profile)
         @JoinColumn()
         profile: Profile;
         
         
 In controller:
 
           const user = new User()
            const profile = new Profile();
            user.profile = profile
