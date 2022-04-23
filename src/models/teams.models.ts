import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/entities/team.entity';

@ObjectType()
export class Teams {
  @Field(() => [Team], { nullable: true })
  teams?: Team[];

  @Field()
  count!: number;
}
