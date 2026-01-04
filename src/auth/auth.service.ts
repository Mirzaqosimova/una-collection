import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/repositories/users';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ErrorMessagesKeys } from 'src/common/types/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private async generateJwt(user: any) {
    return this.jwt.signAsync(user, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
  }

  private async generateRefreshToken(user: any) {
    try {
      const refreshToken = await this.jwt.signAsync(
        { user: user.id },
        {
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      );

      return refreshToken;
    } catch (error) {
      throw error;
    }
  }

  private comparePasswords(password: string, storePassword: string) {
    return bcrypt.compare(password, storePassword);
  }
  async login(data: LoginDto) {
    const { password, ...payload } = data;
    const hasEmployee = await this.usersRepository.findBy({
      ...payload,
    });
    if (!hasEmployee) {
      throw new UnauthorizedException(ErrorMessagesKeys.UNAUTHORIZED);
    }
    console.log(hasEmployee, password);
    const isMatch = await this.comparePasswords(password, hasEmployee.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessagesKeys.WRONG_PASSWORD);
    }

    delete hasEmployee.password;
    return {
      ...hasEmployee,
      access_token: await this.generateJwt(hasEmployee),
    };
  }
  isValidUser(id: number) {
    return this.usersRepository.findBy({ id });
  }
}
