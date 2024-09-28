import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//TODO: Create variable 'jwt' into env file
export class JwtAuthGuard extends AuthGuard('jwt') {}
