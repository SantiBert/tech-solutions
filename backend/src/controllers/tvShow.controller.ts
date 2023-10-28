import { NextFunction, Request, Response } from 'express';
import { TVShowService, UserService } from '@/services';
import { STATUS_CODES } from '@/constants';
import {
    tvShowNotFoundException,
    tvShowCreatedException
} from '@/errors/tvShow.controller';

class TvShowController {
    public tvShow = new TVShowService();
    public filmMaker = new UserService();

    public getTvShows = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tvShowData = await this.tvShow.findAllTVShow();
            res.status(STATUS_CODES.OK).json({
                data: tvShowData,
                message: 'All Tv Shows'
            });
        } catch (error) {
            next(error);
        }
    };

    public getTvShow = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tvShowId = Number(req.params.id);
            const tvShowData = await this.tvShow.findTVShowById(tvShowId);

            if (!tvShowData) {
                throw tvShowNotFoundException("Tv Show Not Found");
            }

            const title = tvShowData.title


            res.status(STATUS_CODES.OK).json({
                data: tvShowData,
                message: `${title}`
            });
        } catch (error) {
            next(error);
        }
    };

    public createTvShow = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const {title , actorsIds , seasons} = req.body;

            const tvShowData: any = {
                title
            };

            const createdTvShow:any = await this.tvShow.createTVShow(tvShowData);

            if (!createdTvShow) {
                throw tvShowCreatedException("Tv SHow Not Created");
            }
            
            if (actorsIds.length > 1){
                const actors:any = await this.filmMaker.findManyUser(actorsIds);
                await this.tvShow.addActorToTvShow(createdTvShow.id, actors);
            }

            if(seasons.length > 1){
                for(const season of seasons){
                    let data:any = {number:season.number, tvShowId:createdTvShow.id}
                    const createSeason:any = await this.tvShow.createSeason(data);
                    const episodes = season.episodes;
                    if(episodes.length > 1){
                        for(const episode of episodes){
                            let directorId = episode.directorId;

                            const directorExist = await this.filmMaker.findById(directorId);

                            const episodie = await this.tvShow.createEpisode({...episode, seasonId:createSeason.id,directorId:null })
                            if (directorExist){
                                await this.tvShow.createDirectoForEpisodio(directorId,episodie.id)
                            }
                        }
                    }
                }
            }
            
            res.status(STATUS_CODES.OK).json({
                data: createdTvShow,
                message: 'created'
            });
            
        }catch (error) {
            next(error);
        }
    }

    public editTvShow = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tvShowId = Number(req.params.id);

            const {title , actorsIds , seasons} = req.body;

            const tvShowToEdit:any =  await this.tvShow.findTVShowById(tvShowId);

            if (!tvShowToEdit) {
                throw tvShowNotFoundException("Tv Show Not Found");
            }
            
            await this.tvShow.updateTVShowById(tvShowId,title)
            
            if (actorsIds && actorsIds.length > 1){
                await this.tvShow.clearActorsToTvShow(tvShowId);
                const actors:any = await this.filmMaker.findManyUser(actorsIds);
                await this.tvShow.addActorToTvShow(tvShowToEdit.id, actors);
            }

            if(seasons && seasons.length > 1){
                await this.tvShow.deleteSeasonByTvShowId(tvShowId);
                for(const season of seasons){
                    let data:any = {number:season.number, tvShowId:tvShowToEdit.id}
                    const createSeason:any = await this.tvShow.createSeason(data);
                    const episodes = season.episodes;
                    if(episodes.length > 1){
                        for(const episode of episodes){
                            let directorId = episode.directorId;

                            const directorExist = await this.filmMaker.findById(directorId);
                            if (!directorExist){
                                directorId = null
                            }

                            await this.tvShow.createEpisode({...episode, seasonId:createSeason.id, directorId})
                        }
                    }
                }
            }

            const editedTvShow:any =  await this.tvShow.findTVShowById(tvShowId);

            res.status(STATUS_CODES.OK).json({
                data: editedTvShow,
                message: 'created'
            });

        } catch (error) {
            next(error);
        }
    }

    public deleteTvShow = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tvShowId = Number(req.params.id);

            const tvShowExist:any =  await this.tvShow.findTVShowById(tvShowId);

            if (!tvShowExist) {
                throw tvShowNotFoundException("Tv Show Not Found");
            }

            const tvShowName = tvShowExist?.title;

            await this.tvShow.deleteAllTvShowDataById(tvShowId);

            res.status(STATUS_CODES.OK).json({
                message: `${tvShowName} Deleted`
            });
        } catch (error) {
            next(error);
        }
    }
}

export default TvShowController