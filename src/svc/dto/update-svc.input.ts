import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateSvcInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  icon?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  url!: string;
}
