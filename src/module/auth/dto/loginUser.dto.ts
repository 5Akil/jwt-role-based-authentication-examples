// export class LoginUserDto {
//   email: string;
//   password: string;
// }

import {IsEmail , IsNotEmpty ,MinLength ,IsString,MaxLength ,  Matches} from 'class-validator'

export class LoginUserDto{
  @IsEmail()
  @IsNotEmpty()
  email : string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
