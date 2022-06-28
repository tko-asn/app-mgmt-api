import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Profile } from 'src/entities/profile.entity';
import { CommentsOnComment } from 'src/models/comments-on-comment.model';
import { ProfileService } from 'src/profile/profile.service';
import { SvcService } from 'src/svc/svc.service';
import { Repository } from 'typeorm';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly profileService: ProfileService,
    private readonly svcService: SvcService,
  ) {}

  async findAndCountBySvcId(svcId: string, page = 1, all = false) {
    const pageSize = all ? page * 10 : 10;
    const skip = all ? 0 : (page - 1) * pageSize;
    const [comments, count] = await this.commentRepository
      .createQueryBuilder('comment')
      .select((subQuery) => {
        return subQuery
          .select('COUNT(user.id)')
          .from(Profile, 'user')
          .innerJoin(
            'user.likedComments',
            'likedComment',
            'likedComment.id = comment.id',
          );
      }, 'count')
      .innerJoin('comment.svc', 'svc', 'svc.id = :svcId', {
        svcId,
      })
      .innerJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('comment.dislikes', 'dislikes')
      .orderBy('count', 'DESC')
      .addOrderBy('comment.createdAt', 'ASC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
    return {
      comments,
      count,
      page,
    };
  }

  async findAndCountByCommentIds(commentIds: string[], page?: number) {
    const commentsData: CommentsOnComment[] = [];
    for (const commentId of commentIds) {
      const comments = await this.findAndCountByCommentId(commentId, page);
      commentsData.push({ commentId, ...comments });
    }
    return commentsData;
  }

  async findAndCountByCommentId(commentId: string, page = 1, all = false) {
    const pageSize = all ? page * 10 : 10;
    const skip = all ? 0 : (page - 1) * pageSize;
    const [comments, count] = await this.commentRepository.findAndCount({
      relations: ['author', 'likes', 'dislikes', 'comment'],
      where: {
        comment: {
          id: commentId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
      skip,
      take: pageSize,
    });
    return {
      comments,
      count,
      page,
    };
  }

  async findOneById(id: string) {
    const comment = await this.commentRepository.findOne(id, {
      relations: ['author', 'likes', 'dislikes', 'svc', 'comment'],
    });
    if (!comment) {
      throw new NotFoundException('Could not find comment');
    }
    return comment;
  }

  async create(comment: CreateCommentInput) {
    const { authorId, svcId, commentId, ...commentProps } = comment;
    if (!svcId && !commentId) {
      throw new BadRequestException(
        'You must specify either svcId or commentId',
      );
    }
    const createdComment = this.commentRepository.create(commentProps);

    const author = await this.profileService
      .findOneById(authorId)
      .catch((err) => {
        if (err.status === 404) {
          throw new BadRequestException('Invalid authorId');
        }
        throw err;
      });
    createdComment.author = author;

    if (svcId) {
      const svc = await this.svcService.findOneById(svcId).catch((err) => {
        if (err.status === 404) {
          throw new BadRequestException('Invalid svcId');
        }
        throw err;
      });
      createdComment.svc = svc;
    } else if (commentId) {
      const comment = await this.findOneById(commentId).catch((err) => {
        if (err.status === 404) {
          throw new BadRequestException('Invalid commentId');
        }
        throw err;
      });
      if (comment.commentId) {
        throw new BadRequestException(
          'You can only comment on Svc or comments on Svc',
        );
      }
      createdComment.comment = comment;
    }
    return await this.commentRepository.save(createdComment);
  }

  async addLikeToComment(id: string, profileId: string) {
    const comment = await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid id');
      }
      throw err;
    });

    const [profile] = await this.profileService.validateProfileIds(
      [profileId],
      comment.likes,
    );
    // 既にユーザーがいいねしているコメントの場合
    if (!profile) {
      throw new BadRequestException('This user has already liked');
    }

    if (comment.likes) {
      comment.likes.push(profile);
    } else {
      comment.likes = [profile];
    }
    return await this.commentRepository.save(comment);
  }

  async removeLikeFromComment(id: string, profileId: string) {
    const comment = await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid id');
      }
      throw err;
    });
    if (!comment.likes?.length) {
      throw new BadRequestException('No user likes this comment');
    }

    const profiles = await this.profileService.validateProfileIds(
      [profileId],
      comment.likes,
    );

    if (profiles.length) {
      throw new BadRequestException('This user does not like');
    }

    comment.likes = comment.likes.filter((profile) => profile.id !== profileId);
    return await this.commentRepository.save(comment);
  }

  async addDislikeToComment(id: string, profileId: string) {
    const comment = await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid id');
      }
      throw err;
    });

    const [profile] = await this.profileService.validateProfileIds(
      [profileId],
      comment.dislikes,
    );
    // 既にユーザーがいいねしているコメントの場合
    if (!profile) {
      throw new BadRequestException('This user has already disliked');
    }

    if (comment.dislikes) {
      comment.dislikes.push(profile);
    } else {
      comment.dislikes = [profile];
    }
    return await this.commentRepository.save(comment);
  }

  async removeDislikeFromComment(id: string, profileId: string) {
    const comment = await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid id');
      }
      throw err;
    });
    if (!comment.dislikes?.length) {
      throw new BadRequestException('No user dislikes this comment');
    }

    const profiles = await this.profileService.validateProfileIds(
      [profileId],
      comment.dislikes,
    );

    if (profiles.length) {
      throw new BadRequestException('This user does not dislike');
    }

    comment.dislikes = comment.dislikes.filter(
      (profile) => profile.id !== profileId,
    );
    return await this.commentRepository.save(comment);
  }

  async update(id: string, content: string) {
    await this.findOneById(id);
    return await this.commentRepository.save({ id, content });
  }

  async delete(id: string) {
    const comment = await this.findOneById(id);
    await this.commentRepository.remove(comment);
    return comment;
  }
}
