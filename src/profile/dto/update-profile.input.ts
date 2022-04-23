import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  icon?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  selfIntro?: string;
}
