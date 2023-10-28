import {
    User,
    TVShow,
    Season,
    Episode
} from '@prisma/client';
import prisma from '@/db';

export class TVShowService {
    public tvShows = prisma.tVShow;
    public seasons = prisma.season;
    public episodies = prisma.episode;
    public actorTvShow = prisma.actorTvShow;
    public director = prisma.director

    public async findAllTVShow(): Promise<Partial<TVShow>[]| null>{
        return await this.tvShows.findMany({
            select:{
                id:true,
                title:true,
                createdAt:true,
                seasons:{
                    select:{
                        id:true,
                        number:true,
                        createdAt:true,
                        episodes:{
                            select:{
                                id:true,
                                number:true,
                                directorId:true,
                                director:{
                                    select:{
                                        id:true,
                                        createdAt:true,
                                        user:{
                                            select:{
                                                id:true,
                                                full_name:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                actors:{
                    select:{
                        user:{
                            select:{
                                id:true,
                                full_name:true
                            }
                        }
                    }
                }          
                
            }
        })
    }
    public async findTVShowById(tvshow_id:number): Promise<Partial<TVShow>| null>{
        return await this.tvShows.findUnique({
            select:{
                id:true,
                title:true,
                createdAt:true,
                seasons:{
                    select:{
                        id:true,
                        number:true,
                        createdAt:true,
                        episodes:{
                            select:{
                                id:true,
                                number:true,
                                directorId:true,
                                director:{
                                    select:{
                                        id:true,
                                        createdAt:true,
                                        user:{
                                            select:{
                                                id:true,
                                                full_name:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                actors:{
                    select:{
                        user:{
                            select:{
                                id:true,
                                full_name:true
                            }
                        }
                    }
                }  
            },
            where:{
                id:tvshow_id
            }
        })
    }
    public async createTVShow(data:TVShow): Promise<Partial<TVShow> | null> {
        return await this.tvShows.create({
          select: {id: true},
          data
        });
    }

    public async updateTVShowById(
        id:number,
        title:string
      ): Promise<Partial<TVShow> | null> {
        return await this.tvShows.update({
          select: {id: true},
          data:{
            title
          },
          where: {id}
        });
    }
    
    public async deleteTVShowById(id: number): Promise<void> {
        await this.tvShows.delete({where: {id}});
    }

    public async deleteTVShowActorsById(tv_show_id: number): Promise<void> {
        await this.actorTvShow.deleteMany({where:{tv_show_id}});
    }

    public async addActorToTvShow(tvshow_id: number, actors:User[]): Promise<void> {
        for (const actor of actors){
         await this.actorTvShow.create({
             data:{
                tv_show_id:tvshow_id,
                user_id:actor.id
             }
         })
        }
    }

    public async clearActorsToTvShow(tv_show_id:number): Promise<void>{
        await this.actorTvShow.deleteMany({
            where:{
                tv_show_id
            }
        })
    }

    public async findSeasonsByTVShowId(tvshow_id:number): Promise<Partial<Season>[]| null>{
        return await this.seasons.findMany({
            select:{
                id:true,
                number:true,
                createdAt:true,
                tvShowId:true,
                tvShow:{
                    select:{
                        id:true,
                        title:true,
                        createdAt:true,
                        actors:{
                            select:{
                                user:{
                                    select:{
                                        id:true,
                                        full_name:true
                                    }
                                }
                            }
                        }  
                    }
                },
                episodes:{
                    select:{
                        id:true,
                        number:true,
                        directorId:true,
                        director:{
                            select:{
                                id:true,
                                createdAt:true,
                                user:{
                                    select:{
                                        id:true,
                                        full_name:true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where:{
                tvShowId:tvshow_id
            }
        })
    }

    public async findSeasonById(season_id:number): Promise<Partial<Season>| null>{
        return await this.seasons.findUnique({
            select:{
                id:true,
                number:true,
                createdAt:true,
                tvShowId:true,
                tvShow:{
                    select:{
                        id:true,
                        title:true,
                        createdAt:true,
                        actors:{
                            select:{
                                user:{
                                    select:{
                                        id:true,
                                        full_name:true
                                    }
                                }
                            }
                        }  
                    }
                },
                episodes:{
                    select:{
                        id:true,
                        number:true,
                        directorId:true,
                        director:{
                            select:{
                                id:true,
                                createdAt:true,
                                user:{
                                    select:{
                                        id:true,
                                        full_name:true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where:{
                id:season_id
            }
        })
    }

    public async createSeason(data:Season): Promise<Partial<Season> | null> {
        return await this.seasons.create({
          select: {id: true},
          data
        });
    }

    public async updateSeasonById(
        id: number,
        data: Partial<Season>
      ): Promise<Partial<Season> | null> {
        return await this.seasons.update({
          select: {id: true},
          data:data,
          where: {id}
        });
    }
    
    public async deleteSeasonById(id: number): Promise<void> {
        await this.seasons.delete({where: {id}});
    }

    public async deleteSeasonByTvShowId(tvShowId: number): Promise<void> {
        const tvShowSeasons:any = await this.findSeasonsByTVShowId(tvShowId);
        for (const season of tvShowSeasons){
            await this.episodies.deleteMany({where: {seasonId:season.id}});
        }
        await this.seasons.deleteMany({where:{tvShowId}});
    }

    public async findEpisodesByTVShowId(tvshow_id:number): Promise<Partial<Episode>[] | null> {
        return await this.episodies.findMany({
            select: {
                id: true,
                number: true,
                directorId: true,
                director: {
                    select: {
                        id:true,
                        createdAt:true,
                        user:{
                            select:{
                                id:true,
                                full_name:true
                            }
                        }
                    }
                },
                season: {
                    select: {
                        id: true,
                        number: true,
                        createdAt: true,
                        tvShowId: true,
                        tvShow: {
                            select: {
                                id: true,
                                title: true,
                                createdAt: true,
                            }
                        }
                    }
                }

            },
            where:{
                season:{
                    tvShowId:tvshow_id
                }
            }
        })
    }

    public async findEpisodeById(episodie_id:number): Promise<Partial<Episode>| null>{
        return await this.episodies.findUnique({
            select: {
                id: true,
                number: true,
                directorId: true,
                director: {
                    select: {
                        id:true,
                        createdAt:true,
                        user:{
                            select:{
                                id:true,
                                full_name:true
                            }
                        }
                    }
                },
                season: {
                    select: {
                        id: true,
                        number: true,
                        createdAt: true,
                        tvShowId: true,
                        tvShow: {
                            select: {
                                id: true,
                                title: true,
                                createdAt: true,
                            }
                        }
                    }
                }

            },
            where:{
                id:episodie_id
            }
        })
    }

    public async createEpisode(data:Episode): Promise<Partial<Episode> | null> {
        return await this.episodies.create({
          select: {id: true},
          data
        });
    }

    public async updateEpisodeById(
        id: number,
        data: Partial<Episode>
      ): Promise<Partial<Episode> | null> {
        return await this.episodies.update({
          select: {id: true},
          data:data,
          where: {id}
        });
    }
    
    public async deleteEpisodeById(id: number): Promise<void> {
        await this.episodies.delete({where: {id}});
    }

    public async deleteEpisodesBySeasonsId(seasonId: number): Promise<void> {
        await this.episodies.deleteMany({where: {seasonId}});
    }

    public async deleteAllTvShowDataById(tvShowId:number): Promise<void>{
        const tvShowSeasons:any = await this.findSeasonsByTVShowId(tvShowId);
        for (const season of tvShowSeasons){
            await this.episodies.deleteMany({where: {seasonId:season.id}});
        }
        await this.seasons.deleteMany({where:{tvShowId}});
        await this.actorTvShow.deleteMany({where:{tv_show_id:tvShowId}})
        await this.tvShows.delete({where:{id:tvShowId}});
    }

    public async createDirectoForEpisodio(directorId:string,movieId:number){
        await this.director.create({
            data:{
                user_id:directorId,
                movies:{
                    connect: { id: movieId },
                }
            }
        })
    }
}