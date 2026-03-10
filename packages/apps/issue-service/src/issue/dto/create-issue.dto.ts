import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
