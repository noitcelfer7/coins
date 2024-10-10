import { ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { PlayerEntity } from '../../player/entities';

config({ path: ['.env.dev', '.env.prod'] });

console.log(process.env.POSTGRES_DB);

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  database: configService.get<string>('TYPEORM_DATABASE'),
  entities: [PlayerEntity],
  host: configService.get<string>('TYPEORM_HOST'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  port: configService.get<number>('TYPEORM_PORT'),
  synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
  type: 'postgres',
  username: configService.get<string>('TYPEORM_USERNAME'),
};

export const typeormConfig = registerAs(
  'typeormConfig',
  () => dataSourceOptions,
);

export default new DataSource(dataSourceOptions);
