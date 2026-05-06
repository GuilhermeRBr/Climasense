import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY') || '';
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader) {
      this.logger.warn('API Key missing in request');
      throw new UnauthorizedException('API Key is required');
    }

    if (apiKeyHeader !== this.apiKey) {
      this.logger.warn('Invalid API Key provided');
      throw new UnauthorizedException('Invalid API Key');
    }

    this.logger.log('API Key validated successfully');
    return true;
  }
}
