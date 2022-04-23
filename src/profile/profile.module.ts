import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
