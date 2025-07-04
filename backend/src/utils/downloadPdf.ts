import puppeteer from "puppeteer";
import path from "path";

type response = {
  success: boolean;
  message: string;
};

export const downloadPdf = async (invoiceId: string): Promise<response> => {
  try {
    const filePath = path.resolve(__dirname, "../../public//pdf/invoice.pdf");
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(`http://localhost:5173/pdf/download/${invoiceId}`, {
      waitUntil: "networkidle2",
    });

    await page.pdf({
      path: filePath,
      printBackground: true,
      margin: {
        top: 1.0,
        bottom: 1.0,
        right: 1.0,
        left: 1.0,
      },
    });

    await browser.close();

    return {
      success: true,
      message: "pdf downloaded",
    };
  } catch (error) {
    console.log("error downloading pdf", error);
    return {
      success: false,
      message: "failed to download pdf",
    };
  }
};
