import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Svc } from './svc.entity';
import { Team } from './team.entity';

@Entity()
@ObjectType()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  username!: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  icon?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  selfIntro?: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt!: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt!: Date;

  @Column()
  @Field()
  userId!: string;

  @OneToMany(() => Svc, (svc) => svc.developer)
  @Field(() => [Svc], { nullable: true })
  services?: Svc[];

  @ManyToMany(() => Team, (team) => team.invitees)
  @JoinTable()
  @Field(() => [Team], { nullable: true })
  inviters?: Team[];

  @ManyToMany(() => Team, (team) => team.members)
  @JoinTable()
  @Field(() => [Team], { nullable: true })
  teams?: Team[];
}
