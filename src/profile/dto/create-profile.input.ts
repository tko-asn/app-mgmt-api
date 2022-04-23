import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field()
  @IsString()
  username!: string;

  @Field()
  @IsString()
  userId!: string;
}
