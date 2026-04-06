import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule, // 👈 ensure this is imported
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET');
        console.log('from auth.module.ts', secret);

        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        const expiresIn = config.get<string>('JWT_EXPIRES_IN') || '24h';

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as '24h' | '7d' | '1h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, PassportModule],
})
export class AuthModule {}
