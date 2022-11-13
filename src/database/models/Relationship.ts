import { Schema, model } from "mongoose";

const relationshipSchema = new Schema({
  user1: {
    required: true,
    type: String,
  },
  user2: {
    required: true,
    type: String,
  },
  relation: {
    required: true,
    type: String,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Relationship = model("Relationship", relationshipSchema, "relations");

export default Relationship;
