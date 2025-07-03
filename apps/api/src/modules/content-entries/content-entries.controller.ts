import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ContentEntriesService } from './content-entries.service';
import { CreateContentEntryDto, UpdateContentEntryDto, QueryContentEntriesDto } from './dto/content-entry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { tbm_user } from '@prisma/client';

@Controller('content-entries')
@UseGuards(JwtAuthGuard)
export class ContentEntriesController {
  constructor(private readonly contentEntriesService: ContentEntriesService) {}

  @Post()
  create(@Body() createContentEntryDto: CreateContentEntryDto, @CurrentUser() user: tbm_user) {
    return this.contentEntriesService.create(createContentEntryDto, user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryContentEntriesDto, @CurrentUser() user: tbm_user) {
    return this.contentEntriesService.findAll(queryDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.contentEntriesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentEntryDto: UpdateContentEntryDto,
    @CurrentUser() user: tbm_user,
  ) {
    return this.contentEntriesService.update(id, updateContentEntryDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.contentEntriesService.remove(id, user.id);
  }
}