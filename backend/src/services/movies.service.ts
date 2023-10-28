import {Movie, User} from '@prisma/client';
import prisma from '@/db';

export class MovieService {
    public movies = prisma.movie;
    public actor = prisma.user;
    public actorMovie = prisma.actorMovie;
    public director = prisma.director;
    public tvShow = prisma.tVShow;

    public async findAllMovie(): Promise<Partial<Movie>[]| null>{
        return await this.movies.findMany({
            select:{
                id:true,
                title:true,
                createdAt:true,
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
    public async findMovieById(movie_id:number): Promise<Partial<Movie>| null>{
        return await this.movies.findUnique({
            select:{
                id:true,
                title:true,
                createdAt:true,
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
                id:movie_id
            }
        })
    }
    public async createMovie(data: Movie): Promise<Partial<Movie> | null> {
        return await this.movies.create({
          data
        });
    }

    public async updateMovieById(
        id: number,
        data: Partial<Movie>
      ): Promise<Partial<Movie> | null> {
        return await this.movies.update({
          data:data,
          where: {id}
        });
    }
    
    public async deleteMovieById(id: number): Promise<void> {
        await this.movies.delete({where: {id}});
    }

    public async clearActorsToMovie(movie_id:number): Promise<void>{
        await this.actorMovie.deleteMany({
            where:{
                movie_id
            }
        })
    }

    public async addDirectorToMovie(movieId: number, directorId:string): Promise<void> {
        await this.director.create({
            data:{
                user_id:directorId,
                movies:{
                    connect: { id: movieId },
                }
            }
        });
        
    }

    public async addActorToAmovie(id: number, actors:any[]): Promise<void> {
       for (const actor of actors){
        await this.actorMovie.create({
            data:{
                movie_id:id,
                user_id:actor.id
            }
        })
       }
    }
    
    public async findAllFilmografyByTitle(title:string){
        const result = await prisma.$transaction([
            this.movies.findMany({
                select:{
                    id:true,
                    title:true,
                    createdAt:true,
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
                where: {
                    title: {
                      contains: title, 
                    },
                },
            }),
            this.tvShow.findMany({
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
                where: {
                    title: {
                      contains: title, 
                    },
                },
            })
        ]);

        
        const [movies, tvShows] = result;
        
        const labeledResults = {
            movies: movies.map((movie) => ({ type: 'Movie', ...movie })),
            tvShows: tvShows.map((tvShow) => ({ type: 'TVShow', ...tvShow })),
        };
         
        return labeledResults
    }
}