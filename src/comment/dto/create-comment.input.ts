import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  svcId?: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  commentId?: string;
}
