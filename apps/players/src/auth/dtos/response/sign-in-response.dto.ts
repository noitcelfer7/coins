import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNzI4OTA1MjE5LCJleHAiOjE3Mjg5OTE2MTl9.eGl5yuln_cQgFnbJ0V3H0yPZI0u7sZzC6o1zL0al9kg',
  })
  accessToken: string;
}
