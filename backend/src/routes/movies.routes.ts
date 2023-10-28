import { Router } from "express";
import { Routes } from '@interfaces/routes.interface';
import MovieController from "@/controllers/movies.controller";
import { 
    CreateMovieDto,
    SearchFilmographyDto,
    UpdateMovieDto
} from "@/dtos/movie.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import authMiddleware from "@/middlewares/auth.middleware";

class MoviesRoute implements Routes {
    public path = '/movies';
    public router = Router();
    public moviesController = new MovieController()

    public constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.get(
          `${this.path}/all`,
          authMiddleware(true),
          this.moviesController.getMovies
        );
        this.router.post(
            `${this.path}/create`,
            authMiddleware(true),
            validationMiddleware(CreateMovieDto, 'body'),
            this.moviesController.createMovie
        );
        this.router.get(
            `${this.path}/detail/:id`,
            authMiddleware(true),
            this.moviesController.getMovie
        );
        this.router.patch(
            `${this.path}/edit/:id`,
            authMiddleware(true),
            validationMiddleware(UpdateMovieDto, 'body'),
            this.moviesController.editMovie
        );
        this.router.delete(
            `${this.path}/delete/:id`,
            authMiddleware(true),
            this.moviesController.deleteMovie
        );
        this.router.get(
            `${this.path}/filmography`,
            validationMiddleware(SearchFilmographyDto, 'query'),
            authMiddleware(true),
            this.moviesController.getFilmography
        );
    }
}

export default MoviesRoute;