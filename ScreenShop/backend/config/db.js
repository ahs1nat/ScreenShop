import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

//reads .env file and puts the variables into process.env
dotenv.config();

//process is a global node.js object
//process.env is the object containing env variables

//debug line
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing from .env file");
}

//neon() returns a sql function which is used to run sql queries
export const sql = neon(process.env.DATABASE_URL);