import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateTeamInput {
  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  teamName?: string;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [ID], { nullable: 'items' })
  @IsArray()
  inviteeIds!: string[];

  @Field(() => [ID])
  @IsArray()
  memberIds!: string[];
}
