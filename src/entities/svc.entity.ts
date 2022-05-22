import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Team } from './team.entity';
import { Comment } from './comment.entity';

@Entity()
@ObjectType()
export class Svc {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ length: 30 })
  @Field()
  name!: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  icon?: string;

  @Column()
  @Field()
  url!: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt!: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt!: Date;

  @ManyToOne(() => Profile, (profile) => profile.services, {
    onDelete: 'CASCADE',
  })
  @Field(() => Profile, { nullable: true })
  developer?: Profile;

  @ManyToOne(() => Team, (team) => team.services)
  @Field(() => Team, { nullable: true })
  team?: Team;

  @OneToMany(() => Comment, (comment) => comment.svc)
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];
}
