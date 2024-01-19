import { UserRole } from '../../user/user.entity';
import { IsNotEmpty, IsString, MaxLength ,IsEmail ,IsEnum , Matches ,MinLength, IsInt, IsOptional} from "class-validator";

export class RegisterUserDto {

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
   firstName: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
   lastName: string;

  @IsEmail()
   email: string;

   @IsString()
   @MinLength(4)
   @MaxLength(20)
   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
   password: string;

  @IsEnum(UserRole)
  @IsOptional()
   role: UserRole;

}