import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import * as jwt from 'express-jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (!isPublic) {
      const { req, res } = GqlExecutionContext.create(context).getContext();
      const jwtCheck = promisify(
        jwt({
          secret: expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
          }),
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256'],
        }),
      );
      await jwtCheck(req, res).catch((err) => {
        throw new UnauthorizedException(err);
      });
    }
    return true;
  }
}
