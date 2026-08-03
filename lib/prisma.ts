import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString)
  throw new Error("ERROR:: Connection String not found. Please set DATABASE_URL.");


const pool = new Pool({
  connectionString: connectionString,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

export { db };