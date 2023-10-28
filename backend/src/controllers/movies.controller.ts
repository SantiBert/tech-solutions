import { NextFunction, Request, Response } from 'express';
import { MovieService } from '@/services';
import { STATUS_CODES } from '@/constants';
import {
    movieNotCreatedException,
    movieNotFoundException
} from '@/errors/movies.error';
import { UserService } from '@/services';

class MovieController {
    public movie = new MovieService();
    public filmMaker = new UserService();

    public getMovies = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const moviesData = await this.movie.findAllMovie();
            res.status(STATUS_CODES.OK).json({
                data: moviesData,
                message: 'All Movies'
            });
        } catch (error) {
            next(error);
        }
    };

    public getMovie = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const movieId = Number(req.params.id);
            const movieData = await this.movie.findMovieById(movieId);

            if (!movieData) {
                throw movieNotFoundException("Movie Not Found");
            }

            res.status(STATUS_CODES.OK).json({
                data: movieData,
                message: 'Movie Find'
            });
        } catch (error) {
            next(error);
        }
    };

    public createMovie = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const {title, directorId, actorsIds } = req.body;
            const movieData: any = {
                title
            }

            const createdMovie:any = await this.movie.createMovie(movieData);

            if (!createdMovie) {
                throw movieNotCreatedException("Movie Not Created");
            }

            await this.movie.addDirectorToMovie(createdMovie.id, directorId)

            const actors:any = await this.filmMaker.findManyUser(actorsIds);

            await this.movie.addActorToAmovie(createdMovie.id, actors)

            res
                .status(STATUS_CODES.CREATED)
                .json({ data: createdMovie, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public editMovie = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const movieId = Number(req.params.id);
            const {title, directorId, actorsIds } = req.body;

            const movieData: any = {
                title,
                directorId
            }
            const movieExist = await this.movie.findMovieById(movieId);

            if (!movieExist) {
                throw movieNotFoundException("Movie Not Found");
            }

            const movieToEdit:any = await this.movie.updateMovieById(movieId, movieData);
            
            if (actorsIds.length > 1){
                await this.movie.clearActorsToMovie(movieToEdit.id);

                const actors:any = await this.filmMaker.findManyUser(actorsIds);
                await this.movie.addActorToAmovie(movieToEdit.id, actors);
            }

            res.status(STATUS_CODES.OK).json({
                data: movieToEdit,
                message: 'updated'
            });
        } catch (error) {
            next(error);
        }
    }

    public deleteMovie = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const movieId = Number(req.params.id);

            const movieExist = await this.movie.findMovieById(movieId);

            if (!movieExist) {
                throw movieNotFoundException("Actor Not Found");
            }

            const movieName = movieExist?.title;

            await this.movie.clearActorsToMovie(movieId);

            const movieToDelete = await this.movie.deleteMovieById(movieId);

            res.status(STATUS_CODES.OK).json({
                message: `${movieName} Deleted`
            });
        } catch (error) {
            next(error);
        }
    }

    public getFilmography= async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const title:any = req.query.title;
    
          const eventsData = await this.movie.findAllFilmografyByTitle(title);
    
          res.status(STATUS_CODES.OK).json({
            data: eventsData,
            message: 'findAll'
          });
        } catch (error) {
          next(error);
        }
      };

}

export default MovieController