import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UserDto} from "./user.dto";
import {Body} from "@nestjs/common";

export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {
    }

    public async findAll() {
        return await this.repository.find();
    }

    public async findOne(id: number) {
        return await this.repository.findOneBy({id: id})
    }

    private async isUniqueUsername(username: string) {
        const user = await this.repository.findOneBy({username: username});
        return user ? true : false;
    }

    public async create(input: UserDto) {
        return await this.repository.save(input);
    }
}