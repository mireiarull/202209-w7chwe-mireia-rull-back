import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  name: {
    type: String,
  },
  job: {
    type: String,
  },
  interest: {
    type: String,
  },
  residence: {
    type: String,
  },
  image: {
    type: String,
  },
  backupImage: {
    type: String,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const User = model("User", userSchema, "users");

export default User;
