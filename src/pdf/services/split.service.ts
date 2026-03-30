import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class SplitService {
    async execute(file: Express.Multer.File, range: string): Promise<Buffer> {
        if(!file) throw new BadRequestException('Archivo no encontrado');

        // Cargar el PDF Original
        const pdfSrc = await PDFDocument.load(file.buffer);
        const totalPages = pdfSrc.getPageCount();
        const newPdf = await PDFDocument.create();

        // 1. Parsear el rango dinámico (Ejemplo: "10-15", "5-END")
        const parts = range.split('-');
        const start = parseInt(parts[0]);
        const end = parts[1].toUpperCase() === 'END' ? totalPages: parseInt(parts[1]);
        
        // 2. Validaciones de seguridad
        if (isNaN(start) || isNaN(end)) {
            throw new BadRequestException('El rango debe tener un formato numérico (ej: "1-5" o "10-END")');
        }
        if (start < 1 || end > totalPages || start > end) {
            throw new BadRequestException(
                `Rango inválido. El documento tiene ${totalPages} páginas. Intentaste extraer de la ${start} a la ${end}.`
            );
        }

        // 3. Crear el array de índices base 0 (página 1 es índice 0) para pdf-lib
        // Si start=10 y end=12, queremos los índices [9, 10, 11]
            const pagesToCopy = Array.from(
            { length: end - start + 1 }, 
            (_, i) => (start - 1) + i 
        );
            

        // 4. Proceso copiado
        const copiedPages = await newPdf.copyPages(pdfSrc, pagesToCopy);
        copiedPages.forEach(page => newPdf.addPage(page));

        return Buffer.from(await newPdf.save());
    }
}
