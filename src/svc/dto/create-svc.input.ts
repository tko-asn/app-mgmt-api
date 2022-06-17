import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { UpdateSvcInput } from './update-svc.input';

@InputType()
export class CreateSvcInput extends UpdateSvcInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  developerId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  teamId?: string;
}
