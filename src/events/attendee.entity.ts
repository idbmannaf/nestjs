import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "./event.entity";
import {AttendeeAnswerEnum} from "../enums/attendee.answer.enum";

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    //Many TO one relationship
    @ManyToOne(() => Event, (event) => event.attendees, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: 'event_id'
    })
    event: Event

    @Column('enum', {
        enum: AttendeeAnswerEnum,
        default: AttendeeAnswerEnum.ACCEPTED
    })
    answer: AttendeeAnswerEnum
}