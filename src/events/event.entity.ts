import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Attendee} from "./attendee.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    when: Date;
    @Column()
    address: string;

    //one to many relationship
    //1. first argument is a function and return relation type,
    //2. the second type is also a function with one argument of the related type and from this function returns a property of the related entity that will point to the owning site
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        onDelete: "CASCADE"
    })
    attendees: Attendee[]

    attendeeCount?: number
    attendeeRejected?: number
    attendeeMaybe?: number
    attendeeAccepted?: number
}