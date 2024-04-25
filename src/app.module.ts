import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EventsModule} from './events/events.module';
import {Event} from "./events/event.entity";
import {AppJapanService} from "./app.japan.service";
import {ConfigModule} from "@nestjs/config";
import ormConfig from './config/orm.config';
import ormConfigProds from './config/orm.config.prods';
import {SchoolModule} from "./school/school.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', //By Default
            load: [ormConfig],
            expandVariables: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProds
        }),
        // TypeOrmModule.forFeature([Event]),
        EventsModule,
        SchoolModule
    ],
    controllers: [AppController],
    providers: [{
        provide: AppService,
        useClass: AppJapanService
    }, {
        provide: 'APP_NAME',
        useValue: 'This Is Form BackEnd'
    }],
})
export class AppModule {
}
