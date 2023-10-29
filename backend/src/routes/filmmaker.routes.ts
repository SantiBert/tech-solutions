import {Router} from 'express';
import FilmMakerController from '@/controllers/filmmaker.controller';

import {Routes} from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { GetFilmMakersDto } from '@/dtos/filmmaker.dto';

class FilmMakerRoute implements Routes {
    public path = '/film-maker';
    public router = Router();
    public filmMakerController = new FilmMakerController();

    public constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}/search`,
            validationMiddleware(GetFilmMakersDto, 'query'),
            authMiddleware(true),
            this.filmMakerController.getFilmMakers
          );
    }
}

export default FilmMakerRoute;