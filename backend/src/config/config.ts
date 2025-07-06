import "dotenv/config";

export const config = {
  PORT: process.env.PORT_NUMBER || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
};

for (const [key, value] of Object.entries(config)) {
  if (!value) {
    console.error(`Missing config: ${key}`);
    throw new Error(`Missing environment variable: ${key}`);
  } else {
    console.log(`✅ ${key} is set`);
  }
}
