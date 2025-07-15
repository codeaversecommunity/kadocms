import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { CloudinaryService } from "./cloudinary.service";

@Module({
  imports: [ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryService],
  exports: [MediaService, CloudinaryService],
})
export class MediaModule {}
