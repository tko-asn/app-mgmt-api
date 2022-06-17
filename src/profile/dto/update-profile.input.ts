import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  selfIntro?: string;
}
