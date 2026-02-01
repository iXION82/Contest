
export class TextExtractionService {
    static async extractTextFromPDF(buffer: Buffer): Promise<string> {
        console.log("Mock PDF Extraction called. Buffer size:", buffer.length);

        
        if (buffer.length < 1000) {
            return "Hello World! This is a test resume PDF.";
        }

        return `MOCK RESUME CONTENT:
        John Doe
        Software Engineer
        Skills: JavaScript, TypeScript, Node.js
        Experience: 5 years at Tech Corp
        Education: BS CS
        `;
    }
}
