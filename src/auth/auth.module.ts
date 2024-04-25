import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {LocalStrategy} from "./strategy/local.strategy";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [LocalStrategy,AuthService],
    exports: []
})
export class AuthModule {

}