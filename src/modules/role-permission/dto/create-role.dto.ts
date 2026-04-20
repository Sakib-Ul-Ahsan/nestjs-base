import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Administrator role with full permissions' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ example: 'manager' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Manager role with limited permissions' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class DeleteRoleDto {
  @ApiProperty({ example: 'role-uuid' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
