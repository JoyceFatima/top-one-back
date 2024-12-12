import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { getToken } from 'src/utils/funcs';
import { AuthService } from './auth.service';
import { ILogin } from './interfaces/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() user: ILogin) {
    try {
      const res = await this.authService.login(user);
      return { message: 'Success', data: res, statusCode: 201 };
    } catch (error) {
      throw { message: error.message, statusCode: 400 };
    }
  }

  @Post('renew-token')
  @UseGuards(new AuthGuard())
  async renewToken(@Headers('Authorization') authHeader: string) {
    const jwt = getToken(authHeader);
    const res = await this.authService.renewToken(jwt);
    return { message: 'Success', data: res, statusCode: 201 };
  }

  // @Post('change-password')
  // @UseGuards(new AuthGuard(), RolesGuard)
  // async changePassword(
  //   @Headers('Authorization') authHeader: string,
  //   @Body() passwords: IChangePassword,
  // ) {
  //   const jwt = getToken(authHeader);
  //   await this.authService.changePassword(jwt, passwords);
  //   return { message: 'Success', statusCode: 201 };
  // }
}