import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Profile } from './profile.entity';
import { Svc } from './svc.entity';

@Entity()
@ObjectType()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ length: 30 })
  @Field()
  teamName!: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt!: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt!: Date;

  @ManyToMany(() => Profile, (profile) => profile.inviters)
  @Field(() => [Profile])
  invitees!: Profile[];

  @ManyToMany(() => Profile, (profile) => profile.teams)
  @Field(() => [Profile])
  members!: Profile[];

  @OneToMany(() => Svc, (svc) => svc.team)
  @Field(() => [Svc], { nullable: true })
  services?: Svc[];
}
