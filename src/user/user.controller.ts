import { User } from './../../generated/prisma/index.d';
import { GetUser } from './../auth/decorator';
import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('me')
    getMe(@GetUser() user: User,) {

        return user;

    }


}