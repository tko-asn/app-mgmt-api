import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
