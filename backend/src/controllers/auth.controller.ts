import {NextFunction, Request, Response} from 'express';
import {
    ActivateAccountDto, 
    LogInDto, 
    SignupDto,
    VerifcateTokenDto
} from '@/dtos/auth.dto';
import { 
    AuthService, 
    PasswordService,
    SessionService,
    UserService,
    ValidationService
} from '@/services';
import { 
    userAlreadyActivatedException, 
    userAlreadyExistsException,
    userDisabledException,
    userOrPasswordWrongException,
    userPendingVerificationException
} from '@/errors/users.error';
import { STATUS_CODES, UserStatus } from '@/constants';
import { getISONow, getUniversalTime } from '@/utils/time';
import { invalidTokenException, missingRefreshTokenException, wrongRefreshTokenException } from '@/errors/auth.error';
import { checkUserLoginGuard } from '@/guards/users.guard';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@prisma/client';
import { genericErrorException,otpExpiredException } from '@/errors/generics.error';

const enum SignupFlow {
    CREATE = 'create',
    UPDATE = 'update'
  }

class AuthController {
    public auth = new AuthService();
    public users = new UserService();
    public password = new PasswordService();
    public session = new SessionService();
    public validation = new ValidationService();

    public signUp = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
            const userData:SignupDto = req.body;
            const findUser = await this.users.findByEmail(userData.email);
            if (findUser) {
              throw userAlreadyExistsException(`El email ${userData.email} ya esta registrado`);
            }
            const createUserData: any = {
                full_name: userData.full_name,
                email: userData.email,
                status: {connect: {id: UserStatus.PENDING_VERIFICATION}}
              };

            const createdUserData = await this.users.create(createUserData)
            
            const createPasswordData: any = {
              hash: await this.auth.hashPassword(userData.password),
              user: {connect: {id: createdUserData.id}}
            }
            
            const [createdValidation] = await Promise.all([
                this.validation.create(createdUserData.id),
                this.password.create(createPasswordData)
              ]);
        
            console.log(createdValidation.token);

            res.status(STATUS_CODES.CREATED).json({
                data: createdUserData,
                message:
                  `Token: ${createdValidation.token}`
              });
        }catch (error) {
            next(error);
        }
    }

    public activateAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const userData: ActivateAccountDto = req.body;
          const isTokenValid = await this.validation.isTokenValid(userData.hash);
          if (!isTokenValid) {
            throw invalidTokenException('Token No valido');
          }
    
          const validationData = await this.validation.findByToken(userData.hash);
          await this.validation.deleteByUserId(validationData.user_id);
    
          const findUser = await this.users.findById(validationData.user_id);
    
          if (findUser.status_id !== UserStatus.PENDING_VERIFICATION) {
            throw userAlreadyActivatedException('Error activating account');
          }
    
          this.users.updateById(validationData.user_id, {
            status_id: UserStatus.ACTIVE
          });
    
          res.status(STATUS_CODES.OK).json({
            data: {id: validationData.user_id},
            message: 'Account has been activated'
          });
        } catch (error) {
          next(error);
        }
    };

    public logIn = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          // always call isPasswordMatching for comparison even though the user do not exists to prevent timing attacks
          const userData: LogInDto = req.body;
          const findUser: any = await this.users.findByEmail(userData.email);
          const isPasswordMatching = await this.password.isPasswordMatching(
            findUser,
            userData.password
          );
          if (
            !findUser ||
            (await this.users.isUserDeleted(userData.email)) ||
            !isPasswordMatching
          ) {
            throw userOrPasswordWrongException('Invalid user or password.');
          }
    
          if (findUser.status_id === UserStatus.PENDING_VERIFICATION) {
            const validationData = await this.validation.findByUserId(findUser.id);
            const isTokenValid = await this.validation.isTokenValid(
              validationData ? validationData.token : ''
            );
            if (isTokenValid) {
              throw userPendingVerificationException(
                'You need to activate your account before login. Please check your email address for a confirmation email.'
              );
            }
            await this.validation.deleteIfUserHas(findUser.id);
            const createdValidation = await this.validation.create(findUser.id);
            
            //Imprimir token createdValidation.token
            
            throw userPendingVerificationException(
              'You need to activate your account before login in. Please check your email address for a confirmation email.'
            );
          } else if (findUser.status_id === UserStatus.DISABLED) {
            await this.validation.deleteIfUserHas(findUser.id);
            const createdValidation = await this.validation.create(findUser.id);
    
            //Imprimir token createdValidation.token

            throw userDisabledException(
              'Your account is disabled. We will send you a reactivation email.'
            );
          }
    
          checkUserLoginGuard(findUser);
         
          const token = this.auth.getToken(findUser.id);
          
          await this.session.create(findUser.id, token.token);
    
          const tokenJWT = this.auth.createJWT(token);

          res.status(STATUS_CODES.OK).json({
            data: {id: findUser.id, token: tokenJWT},
            message: 'Login successful'
          });
        } catch (error) {
          next(error);
        }
    };

    public logOut = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const userData: User = req.user;
          const refreshToken: string = req.header('Authorization').split('Bearer ')[1];
          await this.session.deleteByUserIdAndToken(userData.id, refreshToken);
    
          res.setHeader('Set-Cookie', [`x-refresh-token=; Secure; HttpOnly;`]);
          res.status(STATUS_CODES.OK).json({
            message: 'Logout successful'
          });
        } catch (error) {
          next(error);
        }
    };
    
    public verifyTokenRequest = async (
      req: RequestWithUser,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userData: User = req.user;
        const token: string = req.header('Authorization').split('Bearer ')[1];
        const isTokenValid = await this.validation.isSession(token);
        if (!isTokenValid) {
          throw invalidTokenException('Token No valido');
        }
        res.status(STATUS_CODES.OK).json({
          message: 'Token es valido'
        });
      } catch (error) {
        next(error);
      }
  };

}

export default AuthController;