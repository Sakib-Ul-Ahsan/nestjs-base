import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { UserService } from 'src/modules/users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // 1️⃣ Find user by email
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3️⃣ Generate JWT
    return this.authService.generateToken(user.id, user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.id; // user info comes from JwtAuthGuard
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive info like password before returning
    const { password, ...userSafe } = user;
    return userSafe;
  }
}
