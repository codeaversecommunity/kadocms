import { Module } from '@nestjs/common';
import { ContentEntriesService } from './content-entries.service';
import { ContentEntriesController } from './content-entries.controller';

@Module({
  controllers: [ContentEntriesController],
  providers: [ContentEntriesService],
  exports: [ContentEntriesService],
})
export class ContentEntriesModule {}