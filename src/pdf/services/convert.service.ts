import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class ConvertService {
    async imageToPdf(file: Express.Multer.File): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const image = file.mimetype.includes('png') ? await pdfDoc.embedPng(file.buffer) : await pdfDoc.embedJpg(file.buffer);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

        return Buffer.from(await pdfDoc.save());
    }
}
