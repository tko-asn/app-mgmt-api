import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateComment {
  @Field(() => ID)
  id!: string;

  @Field()
  content!: string;
}
