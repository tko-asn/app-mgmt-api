import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  content!: string;

  @Field(() => ID)
  @IsString()
  authorId!: string;

  @Field(() => ID)
  @IsString()
  @IsOptional()
  svcId?: string;

  @Field(() => ID)
  @IsString()
  @IsOptional()
  commentId?: string;
}
