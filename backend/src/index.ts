import App from '@/app';
import AuthRoute from './routes/auth.routes';
import MoviesRoute from './routes/movies.routes';
import TvShowRoute from './routes/tvShows.routes';
import FilmMakerRoute from './routes/filmmaker.routes';


const app = new App([
    new AuthRoute(),
    new FilmMakerRoute(),
    new MoviesRoute(),
    new TvShowRoute()
]);

app.listen();