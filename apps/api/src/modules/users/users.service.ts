import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.tbm_user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.tbm_user.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar: true,
        email_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.tbm_user.findUnique({
      where: { id, is_deleted: false },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar: true,
        email_verified: true,
        workspace_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.tbm_user.findUnique({
      where: { email, is_deleted: false },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar: true,
        email_verified: true,
        workspace_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.tbm_user.findUnique({
      where: { id, is_deleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.tbm_user.update({
      where: { id },
      data: {
        ...updateUserDto,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar: true,
        email_verified: true,
        workspace_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.tbm_user.findUnique({
      where: { id, is_deleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.tbm_user.update({
      where: { id },
      data: { is_deleted: true, updated_at: new Date() },
    });
  }
}