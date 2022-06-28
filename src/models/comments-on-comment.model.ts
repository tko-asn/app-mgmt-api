import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comments } from './comments.model';

@ObjectType()
export class CommentsOnComment extends Comments {
  @Field(() => ID)
  commentId!: string;
}
