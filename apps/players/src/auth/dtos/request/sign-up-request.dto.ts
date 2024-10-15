import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty({
    example: '12345678',
  })
  password: string;

  @ApiProperty({
    example: 'super-puper',
  })
  username: string;
}
