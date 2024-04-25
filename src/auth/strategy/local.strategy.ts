import {Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Repository} from "typeorm";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name)

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super()
    }

    public async validate(username: string, password: string): Promise<any> {
        this.logger.log(`Validating user ${username} with password ${password}`)

        const user = await this.userRepository.findOneBy({username: username})
        if (!user) {
            this.logger.warn(`User ${username}  Not Found`)
            throw new UnauthorizedException();
        }

        if (user.password !== password) {
            this.logger.warn(`Password ${password} Does not match`)
            throw new UnauthorizedException();
        }

        return user
    }
}