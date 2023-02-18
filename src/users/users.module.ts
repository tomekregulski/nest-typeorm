import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUsdrMiddleware } from './middlewares/current-user.middleware';

@Module({
  // Creates the repository between user module and entity
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // all existing classes that we may want to inject into our DI container, so the DI container can figure out how to create any instance that we want
  providers: [UsersService, AuthService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    // for every route, if a user exists, we can define that user
    consumer.apply(CurrentUsdrMiddleware).forRoutes('*');
  }
}
