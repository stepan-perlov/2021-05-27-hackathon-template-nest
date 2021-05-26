import { config } from 'dotenv';

class EnvParams {
  PG_HOST: string;
  PG_PORT: number;
  PG_USERNAME: string;
  PG_PASSWORD: string | null;
  PG_DATABASE: string;
  TYPEORM_SYNCHRONIZE: boolean;
  TYPEORM_LOGGING: boolean;
  SERVER_PORT: number;
}

export const env = (config().parsed as any) as EnvParams;
