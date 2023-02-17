import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      // this tells the DI system to find the configuration service, which will have all of our config info, from the chosen file,
      //and we want to get access to that instance of the SonfigService during the setup of our TypeOrm module
      inject: [ConfigService],
      // function that receives an instance of our ConfigService (this is the DI part), which will have the desired ENV information
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          // Why synchronize?
          // Prevents need to run migrations in development
          // Instead, every time the app starts up, it will recreate the tables based on the configuration at the time.
          // After deployment - can we still use this in development???
          synchronize: true,
        };
      },
    }),
    // creates the DB connection for entire app
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   // Why synchronize?
    //   // Prevents need to run migrations in development
    //   // Instead, every time the app starts up, it will recreate the tables based on the configuration at the time.
    //   // After deployment - can we still use this in development???
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  // all existing classes that we may want to inject into our DI container, so the DI container can figure out how to create any instance that we want
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // every time an instance of the app module is created, apply this pipe to every request that is received
      useValue: new ValidationPipe({
        // removes unexpected properties from the incoming body
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          // key used to encrypt the information stored in the cookie
          keys: ['asdfgh'],
        }),
        // make use of this middleware on every request in the app
      )
      .forRoutes('*');
  }
}
