import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'users:read' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ example: 'users' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ example: 'Permission to read users' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiPropertyOptional({ example: 'users:write' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ example: 'users' })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiPropertyOptional({ example: 'Permission to write users' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class DeletePermissionDto {
  @ApiProperty({ example: 'permission-uuid' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
