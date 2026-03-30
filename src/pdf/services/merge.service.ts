import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class MergeService {
    async execute(files: Array<Express.Multer.File>): Promise<Buffer> {
        const mergePdf = await PDFDocument.create();
        for (const file of files) {
            const pdf = await PDFDocument.load(file.buffer);
            const copiedPages = await mergePdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergePdf.addPage(page));
        }
        return Buffer.from(await mergePdf.save());
    }
}
