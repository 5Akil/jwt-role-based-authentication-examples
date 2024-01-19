import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const matchRoles = (roles, userRoles) => {
  return roles.some(role => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(context.getHandler());
    console.log(roles, 'roles <==============================');
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest() as any;
    // console.log(req,'<<<<<<<<<<<<<<<<<<<<<<');

    const user = req.user;
    console.log(user, '////////////////////');
    console.log(matchRoles(roles, user.role));
    if (matchRoles(roles, user.role)) {
      return true
    } else {
      throw new HttpException('You have no permission to access this info', HttpStatus.UNAUTHORIZED)
    }
  }
}
