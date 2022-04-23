import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/public.decorator';
import { Team } from 'src/entities/team.entity';
import { Teams } from 'src/models/teams.models';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { TeamService } from './team.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [Team])
  @Public()
  async getTeamsByTeamName(@Args('teamName') teamName: string) {
    return this.teamService.findByTeamName(teamName).catch((err) => {
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
  createTeam(@Args('input', new ValidationPipe()) teamInput: CreateTeamInput) {
    return this.teamService.create(teamInput);
  }

  @Mutation(() => Team)
  updateTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) teamInput: UpdateTeamInput,
  ) {
    return this.teamService.update(id, teamInput);
  }

  @Mutation(() => Team)
  inviteUsersToTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.addInvitees(id, profileIds);
  }

  @Mutation(() => Team)
  deleteInviteesFromTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.deleteInvitees(id, profileIds);
  }

  @Mutation(() => Team)
  addMembersToTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('profileIds', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.addMembers(id, profileIds);
  }

  @Mutation(() => Team)
  deleteMembersFromTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => [String] }) profileIds: string[],
  ) {
    return this.teamService.deleteMembers(id, profileIds);
  }

  @Mutation(() => Team)
  deleteTeam(@Args('id', { type: () => ID }) id: string) {
    return this.teamService.delete(id);
  }
}
