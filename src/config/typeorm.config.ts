import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    if (process.env.NODE_ENV === 'development') {
      return {
        type: this.configService.get<any>('DB_TYPE'),
        synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
      };
    }

    if (process.env.NODE_ENV === 'test') {
      return {
        type: this.configService.get<any>('DB_TYPE'),
        synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: JSON.parse(
          this.configService.get<string>('MIGRATIONS_RUN'),
        ),
      };
    }
    if (process.env.NODE_ENV === 'production') {
      const obj = {
        type: 'postgres',
        synchronize: false,
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        entities: ['**/*.entity.js'],
        migrationsRun: true,
        ssl: {
          rejectUnauthorized: false,
        },
      } as TypeOrmModule;
      console.log(obj);
      return obj;
    }
  }
}
