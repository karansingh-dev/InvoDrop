import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function dbConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error: any) {
    console.error("Failed to connect to the database:", error.message);
    throw new Error(error.message);
  }
}

export default prisma;
