import {Controller, Post} from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Subject} from './subject.entity';
import {Teacher} from './teacher.entity';
import {Profile} from "../auth/profile.entity";
import {User} from "../auth/user.entity";

@Controller('/school')
export class TrainingController {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
    ) {
    }

    @Post('/create')
    public async savingRelation() {

        const user = new User()
        const profile = new Profile();
        user.profile = profile


        //Step 1 Subject With Teacher
        const subject = new Subject();
        subject.name = 'Math';

        const teacher1 = new Teacher();
        teacher1.name = 'John Doe';

        const teacher2 = new Teacher();
        teacher2.name = 'Harry Doe';

        subject.teachers = [teacher1, teacher2];
        await this.teacherRepository.save([teacher1, teacher2]);
        // const result = await this.subjectRepository.save(subject);
        // return result;

    }

    @Post('/remove')
    public async removingRelation() {
        await this.subjectRepository.createQueryBuilder('s')
            .update()
            .set({name: "Confidential"})
            .execute();
    }
}