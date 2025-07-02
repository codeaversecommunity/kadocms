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
import { EntriesService } from './entries.service';
import { CreateEntryDto, UpdateEntryDto, QueryEntriesDto } from './dto/entry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { tbm_user } from '@prisma/client';

@Controller('entries')
@UseGuards(JwtAuthGuard)
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  create(@Body() createEntryDto: CreateEntryDto, @CurrentUser() user: tbm_user) {
    return this.entriesService.create(createEntryDto, user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryEntriesDto, @CurrentUser() user: tbm_user) {
    return this.entriesService.findAll(queryDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.entriesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEntryDto: UpdateEntryDto,
    @CurrentUser() user: tbm_user,
  ) {
    return this.entriesService.update(id, updateEntryDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.entriesService.remove(id, user.id);
  }
}