import {Body, Controller, Param, Post, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {UserDto} from "./user.dto";

@Controller('/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post('login')

    @UseGuards(AuthGuard('local'))
    public async login(@Request() request) {
        return {
            user: request.user.id,
            accessToken: "we are working with it"
        }
    }

    @Post('/create')
    public async create(@Body() input: UserDto){
        return await this.authService.create(input)
    }
}