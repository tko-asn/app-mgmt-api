import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/public.decorator';
import { Comment } from 'src/entities/comment.entity';
import { CommentsOnComment } from 'src/models/comments-on-comment.model';
import { Comments } from 'src/models/comments.model';
import { UpdateComment } from 'src/models/update-comment.model';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => Comments)
  @Public()
  getCommentsBySvcId(
    @Args('svcId', { type: () => ID }) svcId: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('all', { nullable: true }) all?: boolean,
  ) {
    return this.commentService.findAndCountBySvcId(svcId, page, all);
  }

  @Query(() => [CommentsOnComment])
  @Public()
  getCommentsByCommentIds(
    @Args('commentIds', { type: () => [ID], nullable: 'items' })
    commentIds: string[],
    @Args('page', { type: () => Int, nullable: true }) page?: number,
  ) {
    return this.commentService.findAndCountByCommentIds(commentIds, page);
  }

  @Query(() => Comments)
  @Public()
  getCommentsByCommentId(
    @Args('commentId', { type: () => ID }) commentId: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('all', { nullable: true }) all?: boolean,
  ) {
    return this.commentService.findAndCountByCommentId(commentId, page, all);
  }

  @Mutation(() => Comment)
  createComment(
    @Args('input', new ValidationPipe()) commentInput: CreateCommentInput,
  ) {
    return this.commentService.create(commentInput);
  }

  @Mutation(() => Comment)
  likeComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileId', { type: () => ID }) profileId: string,
  ) {
    return this.commentService.addLikeToComment(id, profileId);
  }

  @Mutation(() => Comment)
  removeLike(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileId', { type: () => ID }) profileId: string,
  ) {
    return this.commentService.removeLikeFromComment(id, profileId);
  }

  @Mutation(() => Comment)
  dislikeComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileId', { type: () => ID }) profileId: string,
  ) {
    return this.commentService.addDislikeToComment(id, profileId);
  }

  @Mutation(() => Comment)
  removeDislike(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileId', { type: () => ID }) profileId: string,
  ) {
    return this.commentService.removeDislikeFromComment(id, profileId);
  }

  @Mutation(() => UpdateComment)
  updateComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('content') content: string,
  ) {
    return this.commentService.update(id, content);
  }

  @Mutation(() => Comment)
  deleteComment(@Args('id', { type: () => ID }) id: string) {
    return this.commentService.delete(id);
  }
}
