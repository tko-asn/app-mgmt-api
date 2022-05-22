import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Svc } from './svc.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column('text')
  @Field()
  content!: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt!: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt!: Date;

  @ManyToMany(() => Profile, (profile) => profile.likedComments)
  @Field(() => [Profile], { nullable: true })
  likes?: Profile[];

  @ManyToMany(() => Profile, (profile) => profile.dislikedComments)
  @Field(() => [Profile], { nullable: true })
  dislikes?: Profile[];

  @ManyToOne(() => Profile, (profile) => profile.comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Profile)
  author!: Profile;

  @ManyToOne(() => Svc, (svc) => svc.comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Svc, { nullable: true })
  svc?: Svc;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  commentId?: string;

  @ManyToOne(() => Comment, (comment) => comment.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}
