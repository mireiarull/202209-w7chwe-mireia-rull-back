export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  email: string;
  name: string;
  job: string;
}

export interface RegisterRelationship {
  user1: string;
  user2: string;
  relation: "friends" | "enemies";
}
