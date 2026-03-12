import { IsString, IsUrl, IsArray, ArrayMinSize, IsOptional, IsBoolean } from 'class-validator';

export class CreateWebhookDto {
  @IsString()
  workspaceId!: string;

  @IsUrl()
  url!: string;

  @IsString()
  secret!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  events!: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateWebhookDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
