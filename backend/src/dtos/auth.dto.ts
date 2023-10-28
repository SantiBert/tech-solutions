import {
    IsEmail,
    IsString,
    Length,
    ValidateIf,
    MaxLength,
    IsHexadecimal
  } from 'class-validator';
  
  class EmailValidator {
    @IsEmail()
    public email: string;
  }
  
  export class SignupDto extends EmailValidator {
    @IsString()
    public full_name: string;
  
    @IsString()
    @MaxLength(72)
    public password: string;

    @IsString()
    @MaxLength(72)
    public confirmPassword: string;
    
  }
  
  export class ActivateAccountDto {
    @IsHexadecimal()
    @MaxLength(128)
    public hash: string;
  }
  
  export class LogInDto extends EmailValidator {
    @IsString()
    @MaxLength(72)
    @ValidateIf((object, value) => value !== null)
    public password: string;
  }
  
  export class LogOutDto {}

  export class VerifcateTokenDto {
    @IsHexadecimal()
    @MaxLength(128)
    public token: string;
  }
  
  