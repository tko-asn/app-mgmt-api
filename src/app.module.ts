import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { ProfileResolver } from './profile/profile.resolver';
import { ConfigModule } from '@nestjs/config';
import { SvcModule } from './svc/svc.module';
import { SvcResolver } from './svc/svc.resolver';
import { TeamModule } from './team/team.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true,
      },
      debug: false,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      type: process.env.DB_TYPE,
      entities: ['./dist/**/*.entity.js'],
      extra: {
        ssl: process.env.DB_SSL,
      },
      synchronize: true,
    }),
    ProfileModule,
    SvcModule,
    TeamModule,
    CommentModule,
  ],
  providers: [ProfileResolver, SvcResolver],
})
export class AppModule {}
