import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  login: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  password: string;
}

export class GetTokenUsers {
  @ApiProperty({
    type: String,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  yandex_address?: string;

  @ApiProperty({
    type: String,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    type: String,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;
}
