import { SERVER_URL } from '../constants/global';
import axios from 'axios';
import Cookies from "js-cookie";

const transformData = (inputData) =>{
    const result = [];

  if (inputData.movies) {
    for (const movie of inputData.movies) {
      const movieInfo = {
        type: 'Movie',
        title: movie.title,
        director: movie.director.user.full_name,
        actors: movie.actors.map(actor => actor.user.full_name),
      };
      result.push(movieInfo);
    }
  }

  if (inputData.tvShows) {
    for (const tvShow of inputData.tvShows) {
      const tvShowInfo = {
        type: 'Tv Show',
        title: tvShow.title,
        actors: tvShow.actors.map(actor => actor.user.full_name),
      };
      result.push(tvShowInfo);
    }
  }

  return result;
}

export const searchFilmographyService = async (value) => {
    try {
        const cookies = Cookies.get();
        axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.token}`;
        let url = `${SERVER_URL}movies/filmography?title=${value}`;
        const response = await axios.get(url);
        const result = transformData(response.data.data);
        return result
    } catch (error) {
        return error.response
    }
  };