import { Module } from '@nestjs/common';
import { AuththModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuththModule, UserModule, BookmarkModule, PrismaModule],
})
export class AppModule { }