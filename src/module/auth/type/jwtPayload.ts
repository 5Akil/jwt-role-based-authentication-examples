import { User, UserRole } from '../../user/user.entity';

export interface AccessTokenPayload {
  userId: number;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: number;
}
