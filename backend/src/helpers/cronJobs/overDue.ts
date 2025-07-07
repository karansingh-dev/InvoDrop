import cron from "node-cron";
import prisma from "../prismaClient";

async function updateToOverDue() {
  const currentTime = new Date();

  const invoices = await prisma.invoice.findMany();

  const invoicesToUpdate = invoices.filter(
    (inv) => inv.dueDate < currentTime && inv.status !== "overDue"
  );

  for (const inv of invoicesToUpdate) {
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { status: "overDue" },
    });
  }

  console.log(`Updated ${invoicesToUpdate.length} invoices to overDue`);
}

export function startOverDueJob() {
  cron.schedule("0 0 0 * * *", updateToOverDue); // Runs daily at midnight
}
