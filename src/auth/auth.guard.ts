import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private publicRoutes = [
    { path: '/users/login', method: 'POST' },
    { path: '/users', method: 'POST' }, 
    { path: '/users/forgot-password', method: 'POST' },
    { path: '/users/reset-password', method: 'POST' },
    { path: '/auth/login', method: 'POST' },
    { path: '/admin/login', method: 'POST' }, 
  ];

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    if (this.isPublicRoute(request)) {
      return Promise.resolve(true);
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No se proporcionó un token de autenticación');
    }
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      return Promise.resolve(true);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRoute(request: Request): boolean {
    return this.publicRoutes.some(
      (route) => 
        request.path === route.path && 
        request.method.toUpperCase() === route.method
    );
  }
}