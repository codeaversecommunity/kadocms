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
import { ObjectTypesService } from './object-types.service';
import { CreateObjectTypeDto, UpdateObjectTypeDto } from './dto/object-type.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { tbm_user } from '@prisma/client';

@Controller('object-types')
@UseGuards(JwtAuthGuard)
export class ObjectTypesController {
  constructor(private readonly objectTypesService: ObjectTypesService) {}

  @Post()
  create(@Body() createObjectTypeDto: CreateObjectTypeDto, @CurrentUser() user: tbm_user) {
    return this.objectTypesService.create(createObjectTypeDto, user.id);
  }

  @Get()
  findAll(@Query('workspace_id') workspaceId: string, @CurrentUser() user: tbm_user) {
    return this.objectTypesService.findAll(workspaceId, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.objectTypesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateObjectTypeDto: UpdateObjectTypeDto,
    @CurrentUser() user: tbm_user,
  ) {
    return this.objectTypesService.update(id, updateObjectTypeDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: tbm_user) {
    return this.objectTypesService.remove(id, user.id);
  }
}