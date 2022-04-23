import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateSvcInput {
  @Field()
  @IsString()
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
  url!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  developerId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  teamId?: string;
}
