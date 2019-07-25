import dotenv from 'dotenv';

dotenv.config();

export const development = {
  use_env_variable: 'DATABASE_URL_DEV',
  logging: false
};
export const test = {
  use_env_variable: 'DATABASE_URL_TEST',
  logging: false
};
export const production = {
  use_env_variable: 'DATABASE_URL'
};
