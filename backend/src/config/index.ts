import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type AppEnv = 'development' | 'production' | 'test' | string;

export interface AppConfig {
  env: AppEnv;
  port: number;
}

const config: AppConfig = {
  env: (process.env.NODE_ENV as AppEnv) || 'development',
  port: parseInt(process.env.PORT || '3000', 10)
};

export default config;
