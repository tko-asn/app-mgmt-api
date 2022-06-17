import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from 'src/entities/profile.entity';
import { UpdateProfileInput } from './dto/update-profile.input';
import { ProfileService } from './profile.service';
import { Public } from '../decorators/public.decorator';
import { CreateProfileInput } from './dto/create-profile.input';

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

  @Query(() => Profile)
  getProfileByUserId(@Args('userId') userId: string) {
    return this.profileService.findOneByUserId(userId);
  }

  @Mutation(() => Profile)
  @Public()
  async createProfile(
    @Args('input', new ValidationPipe()) profileInput: CreateProfileInput,
  ) {
    let profile;
    await this.profileService
      .findOneByUserId(profileInput.userId)
      .catch(async (err) => {
        if (err.status === 404) {
          profile = await this.profileService.create(profileInput);
        }
      });
    if (profile) {
      return profile;
    }
    throw new Error('This user already exists');
  }

  @Mutation(() => Profile)
  updateProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) profileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(id, profileInput);
  }

  @Mutation(() => Profile)
  changeIcon(
    @Args('id', { type: () => ID }) id: string,
    @Args('icon') icon: string,
  ) {
    return this.profileService.updateIcon(id, icon);
  }

  @Mutation(() => Profile)
  deleteProfile(@Args('id', { type: () => ID }) id: string) {
    return this.profileService.delete(id);
  }
}
