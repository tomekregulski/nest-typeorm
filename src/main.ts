import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import {CookieSession} from 'cookie-session';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      // key used to encrypt the information stored in the cookie
      keys: ['asdfgh'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // removes unexpected properties from the incoming body
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
