import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Profile } from 'src/entities/profile.entity';

@ObjectType()
export class TeamMembers {
  @Field(() => ID)
  id!: string;

  @Field(() => [Profile])
  members!: Profile[];
}
