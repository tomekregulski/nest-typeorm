import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  // context is wrapper around incoming request
  // handler is something that is going to run at some point in time
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      // if a userId exists on the session, interact with the service to find the relevant entry
      const user = await this.usersService.findOne(userId);

      // if the user is found, attach as a property to the request body
      request.currentUser = user;
    }

    return handler.handle();
  }
}
