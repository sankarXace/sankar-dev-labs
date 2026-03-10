import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MemberService } from './member.service';

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @MessagePattern('addMember')
  addMember(@Payload() payload: { workspaceId: string; actorUserId: string; userId: string; role: string }) {
    return this.memberService.addMember(payload.workspaceId, payload.actorUserId, {
      userId: payload.userId,
      role: payload.role,
    });
  }

  @MessagePattern('listMembers')
  listMembers(@Payload() payload: { workspaceId: string }) {
    return this.memberService.listMembers(payload.workspaceId);
  }

  @MessagePattern('changeRole')
  changeRole(@Payload() payload: { workspaceId: string; memberUserId: string; role: string; actorUserId?: string }) {
    return this.memberService.changeRole(
      payload.workspaceId,
      payload.memberUserId,
      payload.role,
      payload.actorUserId
    );
  }

  @MessagePattern('removeMember')
  removeMember(@Payload() payload: { workspaceId: string; memberUserId: string; actorUserId?: string }) {
    return this.memberService.removeMember(payload.workspaceId, payload.memberUserId, payload.actorUserId);
  }
}
