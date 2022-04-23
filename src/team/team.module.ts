import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), ProfileModule],
  providers: [TeamService, TeamResolver],
  exports: [TeamService],
})
export class TeamModule {}
