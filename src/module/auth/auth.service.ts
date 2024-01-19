import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { AccessTokenPayload, RefreshTokenPayload } from './type/jwtPayload';
import { UserRole } from '../user/user.entity';
import { UserResponse } from '../user/type/userResponse';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  createAccessToken({ userId, role }: AccessTokenPayload): string {
    return sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }

  createRefreshToken({ userId,  }: RefreshTokenPayload): string {
    console.log(sign({ userId,  }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    }));
    
    return sign({ userId,  }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }

  assignTokens(userId: number, role: UserRole) {
    return {
      accessToken: this.createAccessToken({ userId, role }),
      refreshToken: this.createRefreshToken({ userId }),
    };
  }

  /** If refresh token is not expired, re-assign new access token and refresh token */
  async refreshTokens(refreshToken: string) {
    try {
      const decodedRefreshToken = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const user = await this.userService.findOneById(decodedRefreshToken.userId);
      console.log(decodedRefreshToken);
      console.log(user);

      if (!user ) {
        throw new Error('Please register or sign in.');
      }
      const { id, role} = user;
      const tokens = await this.assignTokens(id, role, );
      return {
        user,
        ...tokens,
      };
    }
    catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired. Please register or sign in.');
      }
  
      // Handle other decoding errors if needed
      throw new HttpException('Username or password is invalid', HttpStatus.UNAUTHORIZED);
    }
  }
}
