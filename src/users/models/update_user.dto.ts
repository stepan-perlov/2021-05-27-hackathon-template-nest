import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create_user.dto';

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  version: number;
}
