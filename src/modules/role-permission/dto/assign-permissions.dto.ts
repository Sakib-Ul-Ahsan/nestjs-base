import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class AssignPermissionsToRoleDto {
  @ApiProperty({ example: ['permission-uuid-1', 'permission-uuid-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissionIds: string[];
}

export class RemovePermissionsFromRoleDto {
  @ApiProperty({ example: ['permission-uuid-1', 'permission-uuid-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissionIds: string[];
}
