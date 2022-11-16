import dotenv from "dotenv";
dotenv.config();

export const environment = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbDebug: process.env.DEBUG,
  jwtSecret: process.env.JWT_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_API_KEY,
  supabaseBucketId: process.env.SUPABASE_BUCKET_ID,
};

export default environment;
