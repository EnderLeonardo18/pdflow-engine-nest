import { BadRequestException, Body, Controller, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { MergeService } from './pdf/services/merge.service';
import { SplitService } from './pdf/services/split.service';
import { ConvertService } from './pdf/services/convert.service';
import { EditService } from './pdf/services/edit.service';

@Controller('pdf')
export class PdfController {
    constructor(
        private readonly mergeService: MergeService,
        private readonly splitService: SplitService,
        private readonly convertService: ConvertService,
        private readonly editService: EditService
    ) {}

    @Post('merge')
    @UseInterceptors(FilesInterceptor('files'))
    async merge(
        @UploadedFiles() files: Array<Express.Multer.File>, 
        @Res() res: Response
    ){
        const buffer = await this.mergeService.execute(files);
        this.sendPdf(res, buffer, 'merged.pdf')
    }

    @Post('split') // Recibe 1 PDF para dividirlo
    @UseInterceptors(FileInterceptor('file'))
    async split(
        @UploadedFile() file: Express.Multer.File,
        @Body('range') range: string, // Ejemplo: 1-5 // Aquí llega lo que el usuario escribió en el Front
        @Res() res: Response
    ) {

        // Validación preventiva en el controlador
        if (!file) throw new BadRequestException('Falta el archivo PDF');
        if(!range) throw new BadRequestException('Falta el rango de división');

        const buffer = await this.splitService.execute(file, range);
        this.sendPdf(res, buffer, 'split_document.pdf')
    }

    @Post('watermark')
    @UseInterceptors(FileInterceptor('file'))
    async addWatermark(
        @UploadedFile() file: Express.Multer.File,
        @Body('text') text: string,
        @Res() res: Response
    ){
        const buffer = await this.editService.addWatermark(file, text);
        this.sendPdf(res, buffer, 'watermarked.pdf');
    }

    @Post('image-to-pdf')
    @UseInterceptors(FileInterceptor('file'))
    async imageToPdf(
        @UploadedFile() file: Express.Multer.File, 
        @Res() res: Response
    ) {
        const buffer = await this.convertService.imageToPdf(file);
        this.sendPdf(res, buffer, 'converted.pdf');
    }

    // Función privada para reutilizar la lógica de envío de archivos
    private sendPdf(res: Response, buffer: Buffer, fileName: string) {
        res.set({
        // 1. Le dice al navegador: "Oye, esto no es texto, es un PDF".
        'Content-Type': 'application/pdf',
        // 2. Le dice: "No intentes abrirlo solo, descárgalo con este nombre".
        'Content-Disposition': `attachment; filename=${fileName}`,
        // 3. Indica el tamaño exacto. Ayuda a que el navegador muestre la barra de progreso.
        'Content-Length': buffer.length,
        });
        // 4. Envía los datos binarios y cierra la conexión.
        res.end(buffer);
    }


}
