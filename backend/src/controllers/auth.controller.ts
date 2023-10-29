import {NextFunction, Request, Response} from 'express';
import {
    ActivateAccountDto, 
    LogInDto, 
    SignupDto
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
import { invalidTokenException } from '@/errors/auth.error';
import { checkUserLoginGuard } from '@/guards/users.guard';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@prisma/client';

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

            //Verificamos si el usuario existe segun el email
            const findUser = await this.users.findByEmail(userData.email);

            //En caso de existir notificamos 
            if (findUser) {
              throw userAlreadyExistsException(`El email ${userData.email} ya esta registrado`);
            }

            //Creamos el objeto con los datos del usuario y su status pendiente prendeterminado
            const createUserData: any = {
                full_name: userData.full_name,
                email: userData.email,
                status: {connect: {id: UserStatus.PENDING_VERIFICATION}}
              };

            //Creamos el usuario
            const createdUserData = await this.users.create(createUserData);

            //Creamos el hash para la password
            const createPasswordData: any = {
              hash: await this.auth.hashPassword(userData.password),
              user: {connect: {id: createdUserData.id}}
            }
            
            //Creamos la validación y la contraseña cifrada
            const [createdValidation] = await Promise.all([
                this.validation.create(createdUserData.id),
                this.password.create(createPasswordData)
              ]);
        
             //Retornamos la respuesta con status 201, en este caso como no enviamos el token para activar la cuenta por mail, lo incluimos como message en la respuesta
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
          //Verificamos si el hash es valido
          const isTokenValid = await this.validation.isTokenValid(userData.hash);

          //En caso de no serlo lo notificamos
          if (!isTokenValid) {
            throw invalidTokenException('Token No valido');
          }
          
          //Buscamos y borramos la validación ya que al activar la cuenta no es necesario el registro
          const validationData = await this.validation.findByToken(userData.hash);
          await this.validation.deleteByUserId(validationData.user_id);
          
          //Buscamos al usuario
          const findUser = await this.users.findById(validationData.user_id);
    
          //En caso de que el status del usuario no sea "Verificacion pendiente" lo notificamos
          if (findUser.status_id !== UserStatus.PENDING_VERIFICATION) {
            throw userAlreadyActivatedException('Error activating account');
          }
    
          //Cambiamos el status del Usuario a activado
          this.users.updateById(validationData.user_id, {
            status_id: UserStatus.ACTIVE
          });
          
          //Retornamos un 200
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
          const userData: LogInDto = req.body;
          //Verificamos si el usuario existe segun el email y si la contraseña coincide
          const findUser: any = await this.users.findByEmail(userData.email);
          const isPasswordMatching = await this.password.isPasswordMatching(
            findUser,
            userData.password
          );
          //En caso de que el usuario no exista, este borrado o la contraseña no coincide lo notificamos
          if (
            !findUser ||
            (await this.users.isUserDeleted(userData.email)) ||
            !isPasswordMatching
          ) {
            throw userOrPasswordWrongException('Invalid user or password.');
          }
          //En caso de que el status del usuario sea "Verificacion pendiente" o "Desactivado" lo notificamos
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
            throw userPendingVerificationException(
              'You need to activate your account before login in. Please check your email address for a confirmation email.'
            );
          } else if (findUser.status_id === UserStatus.DISABLED) {
            await this.validation.deleteIfUserHas(findUser.id);
            const createdValidation = await this.validation.create(findUser.id);
            throw userDisabledException(
              'Your account is disabled. We will send you a reactivation email.'
            );
          }
          
          checkUserLoginGuard(findUser);
          
          //Creamos un token para Authorization
          const token = this.auth.getToken(findUser.id);
          
          //Creamos una sesion para el usuario
          await this.session.create(findUser.id, token.token);
          
          const tokenJWT = this.auth.createJWT(token);

          //Retornamos un 200 y el Token para Authorization
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
          //Tomamos el token del header
          const refreshToken: string = req.header('Authorization').split('Bearer ')[1];
          //Borramos la sesion
          await this.session.deleteByUserIdAndToken(userData.id, refreshToken);
          
          res.setHeader('Set-Cookie', [`x-refresh-token=; Secure; HttpOnly;`]);

          //Retornamos un 200
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
        //Tomamos el token del header
        const token: string = req.header('Authorization').split('Bearer ')[1];
        //Verificamos si el token es valido
        const isTokenValid = await this.validation.isSession(token);
        //En caso de no serlo lo notificamos
        if (!isTokenValid) {
          throw invalidTokenException('Token No valido');
        }
        //Retornamos un 200
        res.status(STATUS_CODES.OK).json({
          message: 'Token es valido'
        });
      } catch (error) {
        next(error);
      }
  };

}

export default AuthController;