import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "http://localhost:5000";

const testPdfParse = async () => {
    try {
        console.log("🚀 Testing Full AI Resume Parser Endpoint...\n");

        const form = new FormData();
        const filePath = path.join(__dirname, "../test-resume.pdf");

        if (!fs.existsSync(filePath)) {
            console.error("❌ Test PDF file not found at:", filePath);
            return;
        }

        form.append("files", fs.createReadStream(filePath), { filename: 'test-resume.pdf', contentType: 'application/pdf' });
        form.append("links", JSON.stringify([])); // Empty links for now

        console.log("Sending PDF to /user/parse...");
        const res = await axios.post(`${API_URL}/user/parse`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log("✅ API Response:", res.status);
        console.log("✅ Data:", JSON.stringify(res.data, null, 2));

        if (res.data.user && res.data.user.email) {
            console.log(`✅ Success: User created with email ${res.data.user.email}`);
            console.log(`✅ Extracted Text Preview: ${res.data.extractedTextPreview}`);
            fs.writeFileSync("test_success.txt", "SUCCESS");
        } else {
            console.log("❌ Unexpected response structure (No user object).");
        }

    } catch (error: any) {
        let msg = "";
        if (error.response) {
            msg = `❌ Test failed: ${error.response.status} ${error.response.statusText}\nResponse Data: ${JSON.stringify(error.response.data, null, 2)}`;
        } else {
            msg = `❌ Test Failed: ${error.message || "Unknown Error"}\nFull Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`;
        }
        console.error(msg);
        fs.writeFileSync("test_result.txt", msg);
    }
};

testPdfParse();
