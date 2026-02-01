type PdfParseFn = (buffer: Buffer) => Promise<{ text: string }>;

export async function extractTextFromFiles(
  files: Express.Multer.File[]
): Promise<string> {
  let text = "";

  const pdfParse = (await import("pdf-parse")) as unknown as {
    default: PdfParseFn;
  };

  for (const file of files) {
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse.default(file.buffer);
      text += data.text + "\n";
    }
  }

  return text;
}
