import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import * as fontkit from "fontkit";

function wrapText(text: string, maxWidth: number, font: any, fontSize: number) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach(word => {
        const testLine = currentLine ? currentLine + " " + word : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

export async function generatePdf(materials: any) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = fs.readFileSync(path.resolve("./public/fonts/Roboto-Regular.ttf"));
    const customFont = await pdfDoc.embedFont(fontBytes);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    let y = height - 50;
    const margin = 50;
    const lineHeight = 18;

    const addText = (text: string, size = 12, indent = 0) => {
        const maxWidth = width - margin * 2 - indent;
        const lines = wrapText(text, maxWidth, customFont, size);

        lines.forEach(line => {
            if (y < margin + lineHeight) {
                // новая страница
                page = pdfDoc.addPage();
                y = height - margin;
            }
            page.drawText(line, {
                x: margin + indent,
                y,
                size,
                font: customFont,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        });
    };

    // Заголовок
    addText("Раздаточные материалы", 20);

    y -= 10;
    addText("Конспект:", 14);
    materials.summary.forEach((s: string) => addText("• " + s, 12, 10));

    y -= 10;
    addText("Чек-лист:", 14);
    materials.checklist.forEach((s: string) => addText("☑ " + s, 12, 10));

    y -= 10;
    addText("Карточки:", 14);
    materials.flashcards.forEach((f: any, i: number) => {
        addText(`${i + 1}. Q: ${f.q}`, 12, 10);
        addText(`   A: ${f.a}`, 12, 20);
        y -= 5;
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
