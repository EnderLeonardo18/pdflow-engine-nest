import { Module } from '@nestjs/common';
import { MergeService } from './services/merge.service';
import { ConvertService } from './services/convert.service';
import { EditService } from './services/edit.service';
import { SplitService } from './services/split.service';
import { PdfController } from 'src/pdf.controller';

@Module({
    controllers: [PdfController],
    providers: [
        MergeService,
        SplitService,
        EditService,
        ConvertService,
    ]
})


export class PdfModule {}
