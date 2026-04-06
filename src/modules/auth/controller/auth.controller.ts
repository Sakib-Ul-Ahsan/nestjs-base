import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    // Dummy user — replace with real DB lookup later
    const dummyUser = {
      id: 'dummy-user-id-1234',
      email: dto.email,
    };

    return this.authService.generateToken(dummyUser.id, dummyUser.email);
  }
}
