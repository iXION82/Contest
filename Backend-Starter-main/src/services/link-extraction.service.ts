import axios from "axios";

export class LinkExtractionService {
    static async extractTextFromLink(url: string): Promise<string> {
        try {
            console.log("Extracting text from link:", url);
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });

            const contentType = response.headers["content-type"];
            if (contentType && !contentType.includes("text/html") && !contentType.includes("text/plain")) {
                console.warn(`Skipping link ${url}: Content-Type ${contentType} not supported`);
                return `[Skipped Link: ${url} - Unsupported Content-Type]`;
            }

            // Simple HTML tag stripping (for now, better to use cheerio if extracting mainly text)
            // But user said "Extract text". Rough extraction is fine for AI processing.
            const html = response.data;
            if (typeof html === "string") {
                // Remove script and style tags
                const cleanText = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
                return cleanText.substring(0, 10000); // Limit context
            }

            return String(html).substring(0, 10000);

        } catch (error: any) {
            console.error(`Failed to extract link ${url}:`, error.message);
            return `[Failed to extract content from ${url}: ${error.message}]`;
        }
    }
}
