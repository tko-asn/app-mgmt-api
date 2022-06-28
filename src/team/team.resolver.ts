import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/public.decorator';
import { Team } from 'src/entities/team.entity';
import { TeamInvitees } from 'src/models/team-invitees.models';
import { TeamMembers } from 'src/models/team-members.models';
import { Teams } from 'src/models/teams.models';
import { SetTeamInput } from './dto/set-team.input';
import { TeamService } from './team.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [Team])
  @Public()
  async getTeamsByTeamNameAndMemberId(
    @Args('teamName') teamName: string,
    @Args('memberId') memberId: string,
  ) {
    return this.teamService
      .findByTeamNameAndProfileId(teamName, memberId)
      .catch((err) => {
        if (err.status === 404) {
          return [];
        }
      });
  }

  @Query(() => Teams)
  async getTeamsByMemberId(
    @Args('page', { type: () => Int }) page: number,
    @Args('memberId') memberId: string,
  ) {
    return this.teamService.findAndCountByProfileId(page, memberId);
  }

  @Query(() => Team)
  @Public()
  getTeamById(@Args('id') id: string) {
    return this.teamService.findOneById(id);
  }

  @Mutation(() => Team)
  createTeam(@Args('input', new ValidationPipe()) teamInput: SetTeamInput) {
    return this.teamService.create(teamInput);
  }

  @Mutation(() => Team)
  updateTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) teamInput: SetTeamInput,
  ) {
    return this.teamService.update(id, teamInput);
  }

  @Mutation(() => TeamInvitees)
  inviteUsersToTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.addInvitees(id, profileIds);
  }

  @Mutation(() => TeamInvitees)
  deleteInviteesFromTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.deleteInvitees(id, profileIds);
  }

  @Mutation(() => TeamMembers)
  async addMembersToTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    const teamMembers = await this.teamService.addMembers(id, profileIds);
    await this.teamService.deleteInvitees(id, profileIds);
    return teamMembers;
  }

  @Mutation(() => TeamMembers)
  deleteMembersFromTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.deleteMembers(id, profileIds);
  }

  @Mutation(() => Team)
  deleteTeam(@Args('id', { type: () => ID }) id: string) {
    return this.teamService.delete(id);
  }
}
