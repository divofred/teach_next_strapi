declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string;
      PORT: string;
      ORIGIN: string;
      APP_KEYS: string;
      API_TOKEN_SALT: string;
      ADMIN_JWT_SECRET: string;
      JWT_SECRET: string;
    }
  }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
