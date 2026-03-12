import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Issue {
  @Field(() => ID)
  id!: string;

  @Field()
  workspaceId!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  priority?: string;

  @Field({ nullable: true })
  assigneeId?: string;

  @Field()
  createdById!: string;
}
