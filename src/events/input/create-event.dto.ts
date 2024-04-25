import {IsDateString, IsString, Length} from "class-validator";

export class CreateEventDto {
    @IsString()
    @Length(5, 255,{message: "the name length is more then 5 characters"})
    name: string;
    @Length(5, 255)
    description: string;

    when?: string;
    @Length(5, 255)
    address: string;
}