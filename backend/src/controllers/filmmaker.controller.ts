import {NextFunction, Request, Response} from 'express';
import { UserService } from '@/services';
import { STATUS_CODES } from '@/constants';

class FilmMakerController{
    public filmMaker = new UserService();

    public getFilmMakers= async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const name:any = req.query.name;
    
          const filmMakersData = await this.filmMaker.findByName(name);
    
          res.status(STATUS_CODES.OK).json({
            data: filmMakersData,
            message: 'findAll'
          });
        } catch (error) {
          next(error);
        }
      };
}

export default FilmMakerController;