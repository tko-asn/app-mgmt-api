import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { SvcModule } from 'src/svc/svc.module';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ProfileModule, SvcModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
