import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findByIds(ids: string[]) {
    const profiles = await this.profileRepository.find({
      where: { id: In(ids) },
    });
    if (!profiles.length) {
      throw new NotFoundException('Could not find profiles');
    }
    return profiles;
  }

  async findByUsername(username: string) {
    const profiles = await this.profileRepository.find({
      where: {
        username: Like(`%${username}%`),
      },
    });
    if (!profiles.length) {
      throw new NotFoundException('Could not find profiles');
    }
    return profiles;
  }

  async findOneById(id: string) {
    const profile = await this.profileRepository.findOne(id, {
      relations: ['inviters', 'teams'],
    });
    if (!profile) {
      throw new NotFoundException('Could not find profile');
    }
    return profile;
  }

  async findOneByUserId(userId: string) {
    const profile = await this.profileRepository.findOne({
      relations: ['teams'],
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Could not find profile');
    }
    return profile;
  }

  create(profile: CreateProfileInput) {
    const createdProfile = this.profileRepository.create(profile);
    return this.profileRepository.save(createdProfile);
  }

  async update(id: string, profile: UpdateProfileInput) {
    await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid profile id');
      }
      throw err;
    });
    return await this.profileRepository.save({ id, ...profile });
  }

  async updateIcon(id: string, icon: string) {
    const profile = await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid profile id');
      }
      throw err;
    });
    return await this.profileRepository.save({ ...profile, id, icon });
  }

  async delete(id: string) {
    const profile = await this.findOneById(id);
    await this.profileRepository.remove(profile);
    return profile;
  }

  async validateProfileIds(profileIds: string[], actualProfiles?: Profile[]) {
    let profileIdsToRegister = [...profileIds];

    // profileIdsのprofileが既にactualProfilesに存在しているか検証
    if (actualProfiles) {
      const removeProfileIds: string[] = [];
      for (const profile of actualProfiles) {
        if (profileIds.includes(profile.id)) {
          removeProfileIds.push(profile.id);
        }
      }
      // 存在する場合は削除
      profileIdsToRegister = profileIds.filter(
        (profileId) => !removeProfileIds.includes(profileId),
      );
    }

    if (!profileIdsToRegister.length) {
      return [];
    }

    const profiles = await this.findByIds(profileIdsToRegister).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid profileIds');
      }
      throw err;
    });
    return profiles;
  }
}
