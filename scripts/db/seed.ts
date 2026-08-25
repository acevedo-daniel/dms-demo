import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for database commands.");
}

throw new Error("The demo seed will be added with the domain schema.");
