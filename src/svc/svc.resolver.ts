import { ValidationPipe } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/public.decorator';
import { Svc } from 'src/entities/svc.entity';
import { Svcs } from 'src/models/svcs.model';
import { CreateSvcInput } from './dto/create-svc.input';
import { UpdateSvcInput } from './dto/update-svc.input';
import { SvcService } from './svc.service';

@Resolver(() => Svc)
export class SvcResolver {
  constructor(private readonly svcService: SvcService) {}

  @Query(() => Svcs)
  @Public()
  getSvcs(@Args('page', { type: () => Int }) page: number) {
    return this.svcService.findAll(page);
  }

  @Query(() => Svcs)
  @Public()
  getSvcsByProfileId(
    @Args('page', { type: () => Int }) page: number,
    @Args('profileId') profileId: string,
  ) {
    return this.svcService.findAllByProfileId(page, profileId);
  }

  @Query(() => Svc)
  @Public()
  getSvcById(@Args('id') id: string) {
    return this.svcService.findOneById(id);
  }

  @Mutation(() => Svc)
  createSvc(@Args('input', new ValidationPipe()) svcInput: CreateSvcInput) {
    return this.svcService.create(svcInput);
  }

  @Mutation(() => Svc)
  updateSvc(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', new ValidationPipe()) svcInput: UpdateSvcInput,
  ) {
    return this.svcService.update(id, svcInput);
  }

  @Mutation(() => Svc)
  deleteSvc(@Args('id', { type: () => ID }) id: string) {
    return this.svcService.delete(id);
  }
}
