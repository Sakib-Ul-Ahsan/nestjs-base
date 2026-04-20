import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { UserService } from '../service/users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/auth/guards/permission.guard';
import { FilterUserDto } from '../dto/filter-user.dto';
import { RequirePermissions } from 'src/modules/auth/decorators/permission.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constant';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 👇 READ USERS
  @Get()
  @RequirePermissions(PERMISSIONS.USERS_READ.action)
  @ApiOperation({ summary: PERMISSIONS.USERS_READ.description })
  findAll(@Query() query: FilterUserDto, @Req() req) {
    return this.userService.findAllUsers(query, req.user, req);
  }

  // 👇 CREATE USER
  @Post()
  @RequirePermissions(PERMISSIONS.USERS_CREATE.action)
  @ApiOperation({ summary: PERMISSIONS.USERS_CREATE.description })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() dto: CreateUserDto, @Req() req) {
    return this.userService.createUser(dto, req.user, req);
  }

  // 👇 UPDATE USER
  @Put(':id')
  @RequirePermissions(PERMISSIONS.USERS_UPDATE.action)
  @ApiOperation({ summary: PERMISSIONS.USERS_UPDATE.description })
  @ApiParam({ name: 'id', example: 'user-uuid' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
    return this.userService.updateUser(id, dto, req.user, req);
  }

  // 👇 DELETE USER
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.USERS_DELETE.action)
  @ApiOperation({ summary: PERMISSIONS.USERS_DELETE.description })
  @ApiParam({ name: 'id', example: 'user-uuid' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.deleteUser(id, req.user, req);
  }
}
