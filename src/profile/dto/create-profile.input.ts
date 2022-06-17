import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateProfileInput } from './update-profile.input';

@InputType()
export class CreateProfileInput extends UpdateProfileInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
