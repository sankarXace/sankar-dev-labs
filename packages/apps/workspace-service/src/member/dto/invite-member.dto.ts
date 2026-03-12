import { IsString, IsIn } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsIn(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'])
  role!: string;
}
