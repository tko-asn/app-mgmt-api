import { Module } from '@nestjs/common';
import { SvcService } from './svc.service';
import { SvcResolver } from './svc.resolver';
import { Svc } from 'src/entities/svc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from 'src/profile/profile.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Svc]), ProfileModule, TeamModule],
  providers: [SvcResolver, SvcService],
  exports: [SvcService],
})
export class SvcModule {}
