import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-now", // Prevent crash on init if missing
});

export class OpenAIService {
    static async parseResume(text: string): Promise<any> {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("OPENAI_API_KEY missing. Returning Mock Data.");
            return this.getMockData();
        }

        try {
            const prompt = `
            You are a Resume Parser AI. Extract the following information from the provided resume text and return it as a JSON object matching this schema:
            {
                "name": "Full Name",
                "email": "email@example.com",
                "password": "generated-secure-password", 
                "age": 25 (number, optional),
                "experience": 5 (number of years, optional),
                "skills": ["Skill1", "Skill2"] (array of strings, optional)
            }
            
            If a field is not found, omit it (except name, email, password which are required. Generate a random password if needed).
            Skills should be a list of technologies.
            Experience should be total years as a number.

            Resume Text:
            ${text.substring(0, 15000)}
            `;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" },
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) throw new Error("Empty response from OpenAI");

            return JSON.parse(content);

        } catch (error: any) {
            console.error("OpenAI Parse Error:", error);
            console.warn("Falling back to Mock Data due to OpenAI error.");
            return this.getMockData();
        }
    }

    static getMockData() {
        return {
            name: "Mock User",
            email: `mock.user.${Date.now()}@example.com`,
            password: "mockpassword123",
            age: 30,
            experience: 5,
            skills: ["JavaScript", "TypeScript", "Node.js", "Mocking"]
        };
    }
}
