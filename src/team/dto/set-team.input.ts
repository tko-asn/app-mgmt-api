import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class SetTeamInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  teamName!: string;

  @Field({ nullable: true })
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
