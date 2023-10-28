import { Router } from "express";
import { Routes } from '@interfaces/routes.interface';
import TvShowController from "@/controllers/tvShow.controller";
import { CreateTvShowDto, UpdateTvShowDto } from "@/dtos/tvShow.dto";
import validationMiddleware from "@/middlewares/validation.middleware";
import authMiddleware from "@/middlewares/auth.middleware";

class TvShowRoute implements Routes {
    public path = '/tv-shows';
    public router = Router();
    public tvShowController = new TvShowController()

    public constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.get(
          `${this.path}/all`,
          authMiddleware(true),
          this.tvShowController.getTvShows
        );
        this.router.get(
            `${this.path}/detail/:id`,
            authMiddleware(true),
            this.tvShowController.getTvShow
        );
        this.router.post(
            `${this.path}/create`,
            authMiddleware(true),
            validationMiddleware(CreateTvShowDto, 'body'),
            this.tvShowController.createTvShow
        );
        this.router.patch(
            `${this.path}/edit/:id`,
            authMiddleware(true),
            validationMiddleware(UpdateTvShowDto, 'body'),
            this.tvShowController.editTvShow
        );
        this.router.delete(
            `${this.path}/delete/:id`,
            authMiddleware(true),
            this.tvShowController.deleteTvShow
        );
    }
}

export default TvShowRoute;