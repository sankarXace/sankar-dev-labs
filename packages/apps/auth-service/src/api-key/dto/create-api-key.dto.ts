import { IsString, IsOptional, MinLength, MaxLength, IsInt, Min } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInDays?: number;
}
