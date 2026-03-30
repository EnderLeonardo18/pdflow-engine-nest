import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class EditService {
    async addWatermark(file: Express.Multer.File, text: string): Promise<Buffer> {
        const pdfDoc = await PDFDocument.load(file.buffer);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();

        pages.forEach(page => {
            page.drawText(text, {
                x: 50,
                y: 50,
                size: 30,
                font: font,
                color: rgb(0.95, 0.1, 0.1),
                opacity : 0.5
            });
        });

        return Buffer.from(await pdfDoc.save())
    }
}
