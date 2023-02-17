import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// any class interface - TS doea not have great handling for decorators, but this at least gives some basic type safety
interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// use implements anytime we want to make a new class that satisfies all the requirements of either an abstract class or an interface
// TypeSCript will check to make sure that the new class properly implements all the methods of the implemented interface
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the handler
    // console.log('I am running before the handler');

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log('I am running before the response is sent out');
        return plainToInstance(this.dto /* UserDto */, data, {
          // ensures that the properties returned match only the properties marked as @Expose() in the UserDto
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
