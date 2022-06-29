/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly AUTH0_DOMAIN: string;
    readonly AUTH0_AUDIENCE: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_HOST: string;
    readonly DB_PORT: number;
    readonly DB_NAME: string;
    readonly DB_TYPE: any;
    readonly FRONTEND_ORIGIN: string;
  }
}
