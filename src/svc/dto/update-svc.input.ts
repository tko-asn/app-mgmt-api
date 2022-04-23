import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateSvcInput {
  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  name?: string;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsString()
  @IsOptional()
  icon?: string;

  @Field()
  @IsString()
  @IsOptional()
  url?: string;
}
