import { Controller, Get } from "@nestjs/common";
import { Public } from "./modules/auth/decorators/public.decorator";

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(): string {
    return "Headless CMS API with Supabase Auth and Prisma ORM is running!";
  }

  @Get("health")
  @Public()
  getHealth(): object {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Headless CMS API",
      version: "1.0.0",
    };
  }
}
