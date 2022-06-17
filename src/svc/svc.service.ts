import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Svc } from 'src/entities/svc.entity';
import { ProfileService } from 'src/profile/profile.service';
import { TeamService } from 'src/team/team.service';
import { Repository } from 'typeorm';
import { CreateSvcInput } from './dto/create-svc.input';
import { UpdateSvcInput } from './dto/update-svc.input';

@Injectable()
export class SvcService {
  constructor(
    @InjectRepository(Svc) private readonly svcRepository: Repository<Svc>,
    private readonly profileService: ProfileService,
    private readonly teamService: TeamService,
  ) {}

  async findAll(page: number) {
    const pageSize = 10;
    const [svcs, count] = await this.svcRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      svcs,
      count,
    };
  }

  async findAllByProfileId(page: number, profileId: string) {
    const pageSize = 10;
    const [svcs, count] = await this.svcRepository.findAndCount({
      where: { developer: { id: profileId } },
      relations: ['developer', 'team'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      svcs,
      count,
    };
  }

  async findOneById(id: string) {
    const svc = await this.svcRepository.findOne(id, {
      relations: ['developer', 'team', 'team.members'],
    });
    if (!svc) {
      throw new NotFoundException('Could not find service');
    }
    return svc;
  }

  async create(svc: CreateSvcInput) {
    const { developerId, teamId, ...svcProps } = svc;
    if (!developerId && !teamId) {
      throw new BadRequestException(
        'You must specify either developerId or teamId',
      );
    }
    const createdSvc = this.svcRepository.create(svcProps);
    if (developerId) {
      const developer = await this.profileService
        .findOneById(developerId)
        .catch((err) => {
          if (err.status === 404) {
            throw new BadRequestException('Invalid developerId');
          }
          throw err;
        });
      createdSvc.developer = developer;
    } else if (teamId) {
      const team = await this.teamService.findOneById(teamId).catch((err) => {
        if (err.status === 404) {
          throw new BadRequestException('Invalid teamId');
        }
        throw err;
      });
      createdSvc.team = team;
    }
    return await this.svcRepository.save(createdSvc);
  }

  async update(id: string, svc: UpdateSvcInput) {
    await this.findOneById(id).catch((err) => {
      if (err.status === 404) {
        throw new BadRequestException('Invalid svc id');
      }
      throw err;
    });
    return await this.svcRepository.save({ id, ...svc });
  }

  async delete(id: string) {
    const svc = await this.findOneById(id);
    await this.svcRepository.remove(svc);
    return svc;
  }
}
