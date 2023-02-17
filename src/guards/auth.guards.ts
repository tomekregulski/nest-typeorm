import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // simple check of if the request body contains a logged in user - and thus passes this app's criteria for being logged in
    return request.session.userId;
  }
}
