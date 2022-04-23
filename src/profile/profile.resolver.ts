import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { ProfileService } from './profile.service';
import { Public } from '../decorators/public.decorator';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => [Profile])
  @Public()
  async getProfilesByUsername(@Args('username') username: string) {
    return this.profileService.findByUsername(username).catch((err) => {
      if (err.status === 404) {
        return [];
      }
    });
  }

  @Query(() => [Profile])
  async getProfilesByIds(
    @Args('ids', { type: () => [ID], nullable: 'items' }) ids: string[],
  ) {
    const profiles = await this.profileService.findByIds(ids).catch((err) => {
      if (err.status === 404) {
        return [];
      }
    });
    return profiles;
  }

  @Query(() => Profile)
  @Public()
  getProfileById(@Args('id') id: string) {
    return this.profileService.findOneById(id);
  }

  @Mutation(() => Profile)
  @Public()
  async getOrCreateProfile(
    @Args('input', new ValidationPipe()) profileInput: CreateProfileInput,
  ) {
    const profile = await this.profileService
      .findOneByUserId(profileInput.userId)
      .catch((err) => {
        if (err.status === 404) {
          return this.profileService.create(profileInput);
        }
        throw err;
      });
    return profile;
  }

  @Mutation(() => Profile)
  updateProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) profileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(id, profileInput);
  }

  @Mutation(() => Profile)
  deleteProfile(@Args('id', { type: () => ID }) id: string) {
    return this.profileService.delete(id);
  }
}
