import { TextExtractionService } from "./services/text-extraction.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const test = async () => {
    try {
        // Adjust path to root where test-resume.pdf is
        const pdfPath = path.join(__dirname, "../test-resume.pdf");
        console.log("Reading PDF from:", pdfPath);

        if (!fs.existsSync(pdfPath)) {
            console.error("PDF not found!");
            return;
        }

        const buffer = fs.readFileSync(pdfPath);
        console.log("PDF loaded, size:", buffer.length);

        const text = await TextExtractionService.extractTextFromPDF(buffer);
        console.log("--- Extracted Text Start ---");
        console.log(text);
        console.log("--- Extracted Text End ---");

    } catch (e: any) {
        fs.writeFileSync("error_log.txt", `Error: ${e.message}\nStack: ${e.stack}`);
        console.error("Extraction Failed! See error_log.txt");
    }
};
test();
