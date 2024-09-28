import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//TODO: Create variable 'local' into env file
export class LocalAuthGuard extends AuthGuard('local') {}
