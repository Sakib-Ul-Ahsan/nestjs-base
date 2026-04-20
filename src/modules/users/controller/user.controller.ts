import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../service/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/auth/guards/permission.guard';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return 'this.userService.getHello();';
  }

  @Post()
  create(@Body() dto: CreateUserDto, @Req() req) {
    const actor = req.user;
    return this.userService.createUser(dto, actor, req);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    return this.userService.updateUser(id, dto, req.user, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.deleteUser(id, req.user, req);
  }
}
