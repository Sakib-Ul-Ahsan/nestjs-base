import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from '../../modules/users/entities/user.entity';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_DATABASE', 'nestjs_base'),
    entities: [__dirname + '/../../modules/**/*.enity.{ts,js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    // logging: configService.get<string>('NODE_ENV') === 'development',
    // @TODO: change this
    logging: false,
  };
};
