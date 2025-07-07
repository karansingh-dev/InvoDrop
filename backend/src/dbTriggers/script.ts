import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  //  Enable pgcrypto for UUID generation
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  //  Updated Invoice trigger function
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION log_invoice_activity()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (TG_OP = 'INSERT') THEN
        INSERT INTO "recent_activity" (
          id, user_id, entity_type, entity_id, action, description, created_at
        )
        VALUES (
          gen_random_uuid(),
          NEW.user_id,
          'invoice',
          NEW.id,
          'created',
          CONCAT('Invoice #', NEW.invoice_number, ' was created'),
          NOW()
        );
      END IF;

      IF (TG_OP = 'UPDATE') THEN
        IF (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'paid') THEN
          INSERT INTO "recent_activity" (
            id, user_id, entity_type, entity_id, action, description, created_at
          )
          VALUES (
            gen_random_uuid(),
            NEW.user_id,
            'invoice',
            NEW.id,
            'paid',
            CONCAT('Invoice #', NEW.invoice_number, ' was paid'),
            NOW()
          );
        END IF;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trigger_invoice_activity ON "invoices"`);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_invoice_activity
    AFTER INSERT OR UPDATE ON "invoices"
    FOR EACH ROW
    EXECUTE FUNCTION log_invoice_activity();
  `);

  //  Updated Client trigger function
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION log_client_activity()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (TG_OP = 'INSERT') THEN
        INSERT INTO "recent_activity" (
          id, user_id, entity_type, entity_id, action, description, created_at
        )
        VALUES (
          gen_random_uuid(),
          NEW.user_id,
          'client',
          NEW.id,
          'added',
          CONCAT('Client "', NEW.company_name, '" was added'),
          NOW()
        );
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trigger_client_activity ON "clients"`);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_client_activity
    AFTER INSERT ON "clients"
    FOR EACH ROW
    EXECUTE FUNCTION log_client_activity();
  `);

  console.log(" Triggers updated successfully.");
}

main()
  .catch((e) => {
    console.error(" Error creating triggers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
