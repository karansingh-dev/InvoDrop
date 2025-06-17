import 'dotenv/config'


export const config = {
  PORT: process.env.PORT_NUMBER || 5000,
  JWT_SECRET:process.env.JWT_SECRET ,
  RESEND_API_KEY:process.env.RESEND_API_KEY,
  BCRYPTJS_SALT:process.env.BCRYPTJS_SALT as string
  

};

for (const [key, value] of Object.entries(config)) {
  if (!value) {
    console.error(`Missing config: ${key}`);
    throw new Error(`Missing environment variable: ${key}`);
  } else {
    console.log(`✅ ${key} is set`);
  }
}



