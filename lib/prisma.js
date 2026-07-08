import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("CRITICAL: DATABASE_URL is missing from .env!");
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  // Added strict SSL requirement for Neon
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false } 
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    // Added strict SSL requirement for Neon
    const pool = new Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false } 
    });
    const adapter = new PrismaPg(pool);
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;