import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// This is useful for development, but not for production
// If we are in development, we want to make sure that we can access the Prisma Client
// instance from anywhere in our application
// If we create a new PrismaClient every time the hot reload executes (in development),
// we will overflow the database connection pool and the application will crash

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// After creating the schema, run `pnpm dlx prisma generate` to generate the types (might need to reload TS server)
// Then run `pnpm dlx prisma db push` to create the database using the DATABASE_URL in the .env file
