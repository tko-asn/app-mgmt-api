import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class Comments {
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => Int)
  count!: number;

  @Field(() => Int)
  page!: number;
}
