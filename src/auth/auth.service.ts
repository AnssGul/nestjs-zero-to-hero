import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {

        try {
            const hashedPassword = await argon2.hash(dto.password);

            console.log('Hashed Password:', hashedPassword);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hashedPassword,
                },

            })
            delete user.hash;
            return user;
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
                throw new ForbiddenException('Something went wrong');
            }
        }
    }

    async login(dto: AuthDto) {
        const user = this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }
        const passwordMatches = await argon2.verify((await user).hash, dto.password);

        if (!passwordMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }
        delete (await user).hash;
        return user;
    }
}
