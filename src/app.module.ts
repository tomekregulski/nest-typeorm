import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    // creates the DB connection for entire app
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      // Why synchronize?
      // Prevents need to run migrations in development
      // Instead, every time the app starts up, it will recreate the tables based on the configuration at the time.
      // After deployment - can we still use this in development???
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  // all existing classes that we may want to inject into our DI container, so the DI container can figure out how to create any instance that we want
  providers: [AppService],
})
export class AppModule {}
