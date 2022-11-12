export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  email: string;
  name: string;
  job: string;
}
