import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/signup.dto';
import { LocalGuard } from './local.guard';
import { LoggedInGuard } from './logged-in.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signUp(@Body() user: SignUpDTO) {
    return this.authService.signUp(user);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req) {
    return req.session;
  }

  @Get('me')
  @UseGuards(LoggedInGuard)
  async me(@Req() req) {
    return req.user;
  }
}
