import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Svc } from '../entities/svc.entity';

@ObjectType()
export class Svcs {
  @Field(() => [Svc], { nullable: true })
  svcs?: Svc[];

  @Field(() => Int)
  count!: number;
}
