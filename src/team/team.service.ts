import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { ProfileService } from 'src/profile/profile.service';
import { Repository } from 'typeorm';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    private readonly profileService: ProfileService,
  ) {}

  async findByTeamNameAndProfileId(teamName: string, profileId: string) {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member', 'member.id = :profileId', {
        profileId,
      })
      .where('team.teamName like :teamName', { teamName: `%${teamName}%` })
      .getMany();
    if (!teams.length) {
      throw new NotFoundException('Cound not find teams');
    }
    return teams;
  }

  async findAndCountByProfileId(page: number, profileId: string) {
    const pageSize = 10;
    const [teams, count] = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member', 'member.id = :profileId', {
        profileId,
      })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return {
      teams,
      count,
    };
  }

  async findOneById(id: string) {
    const team = await this.teamRepository.findOne(id, {
      relations: ['invitees', 'members', 'services'],
    });
    if (!team) {
      throw new NotFoundException('Could not find team');
    }
    return team;
  }

  async create(team: CreateTeamInput) {
    const { inviteeIds, memberIds, ...teamProps } = team;
    if (!memberIds.length) {
      throw new Error('Team needs at least one member');
    }
    const createdTeam = this.teamRepository.create(teamProps);
    const members = await this.profileService.validateProfileIds(memberIds);
    createdTeam.members = members;

    const invitees = await this.profileService.validateProfileIds(
      inviteeIds,
      members,
    );
    createdTeam.invitees = invitees;
    return await this.teamRepository.save(createdTeam);
  }

  async update(id: string, team: UpdateTeamInput) {
    const { teamName, description, inviteeIds, memberIds } = team;
    if (!memberIds.length) {
      throw new Error('Team needs at least one member');
    }
    const updatedTeam = await this.validateTeam(id);
    teamName && (updatedTeam.teamName = teamName);
    description && (updatedTeam.description = description);

    const members = await this.profileService.validateProfileIds(memberIds);
    updatedTeam.members = members;

    const invitees = await this.profileService.validateProfileIds(
      inviteeIds,
      members,
    );
    updatedTeam.invitees = invitees;
    return await this.teamRepository.save(updatedTeam);
  }

  async validateTeam(id: string) {
    const team = await this.findOneById(id);
    if (!team.members.length) {
      throw new BadRequestException('Invalid team');
    }
    return team;
  }

  async addInvitees(id: string, profileIds: string[]) {
    const { invitees: currentInvitees } = await this.validateTeam(id);
    const newInvitees = await this.profileService.validateProfileIds(
      profileIds,
      currentInvitees,
    );
    const invitees = currentInvitees
      ? currentInvitees.concat(newInvitees)
      : newInvitees;
    return await this.teamRepository.save({ id, invitees });
  }

  async deleteInvitees(id: string, nonInviteeeIds: string[]) {
    const { invitees: currentInvitees } = await this.validateTeam(id);
    const invitees = currentInvitees.filter(
      (invitee) => !nonInviteeeIds.includes(invitee.id),
    );
    return await this.teamRepository.save({ id, invitees });
  }

  async addMembers(id: string, profileIds: string[]) {
    const { members: currentMembers } = await this.validateTeam(id);
    const newMembers = await this.profileService.validateProfileIds(
      profileIds,
      currentMembers,
    );
    const members = currentMembers.concat(newMembers);
    return await this.teamRepository.save({ id, members });
  }

  async deleteMembers(id: string, nonMemberIds: string[]) {
    const { members: currentMembers } = await this.validateTeam(id);
    if (currentMembers.length === 1) {
      throw new Error('Team needs at least one member');
    }
    const members = currentMembers.filter(
      (member) => !nonMemberIds.includes(member.id),
    );
    return await this.teamRepository.save({ id, members });
  }

  async delete(id: string) {
    const team = await this.findOneById(id);
    await this.teamRepository.remove(team);
    return team;
  }
}
