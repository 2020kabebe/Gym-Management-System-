import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not set
  port: parseInt(process.env.DB_PORT || '5432'), // Default to 5432 if not set
  username: process.env.DB_USERNAME || 'postgres', // Default to 'postgres' if not set
  password: process.env.DB_PASSWORD || 'amahoro', // Default to 'amahoro' if not set
  database: process.env.DB_DATABASE || 'gym_management', // Default to 'gym_management' if not set
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Be careful with this in production environments
};
