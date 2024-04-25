import {IsString, Length} from "class-validator";

export class UserDto
{
    @IsString()
    @Length(5,20)
    username: string;

    @IsString()
    @Length(5,20)
    password: string;

    @IsString()
    @Length(5,20)
    email: string;

    @IsString()
    @Length(5,20)
    firstName: string;

    @IsString()
    @Length(5,20)
    lastName?: string;
}