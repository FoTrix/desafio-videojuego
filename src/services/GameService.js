import axios from 'axios';

const API_KEY = '3c9cf71fcb9342999e5249e4be868584';
const BASE_URL = 'https://api.rawg.io/api';

// ? crear instacia preterderminada 
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
});

const GameService = {
  // * AGREGAMOS LAS PETICIONES GET

  // ? OBTENEMOS LOS JUEGOS
  getGames: async ({
    page = 1,
    pageSize = 20,
    search = '',
    ordering = '-metacritic',
    platforms = '',
    genres = '',
    tags = '',
    developers = '',
    dates = ''
  } = {}) => {
    try {
      const response = await axiosInstance.get('/games', {
        params: {
          page,
          page_size: pageSize,
          search,
          ordering,
          platforms: platforms ? platforms.toString() : undefined,
          genres: genres ? genres.toString() : undefined,
          tags: tags ? tags.toString() : undefined,
          developers: developers ? developers.toString() : undefined,
          dates,
          metacritic: "75,100"
        }
      });
      console.log('API Response:', response.data);
      if (!response.data.results || response.data.results.length === 0) {
        console.log('No games found with current filters');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch games. Please try again later.');
    }
  },

  // ? OBTENEMOS UN JUEGO
  getGameDetails: async (gameId) => {
    try {
      const [gameDetails, gameTrailers] = await Promise.all([
        axiosInstance.get(`/games/${gameId}`),
        axiosInstance.get(`/games/${gameId}/movies`)
      ]);
      return {
        ...gameDetails.data,
        trailers: gameTrailers.data.results
      };
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw new Error('Failed to fetch game details. Please try again later.');
    }
  },

  // ? OBTENEMOS LAS PLATAFORMAS
  getPlatforms: async () => {
    try {
      const response = await axiosInstance.get('/platforms');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      throw new Error('Failed to fetch platforms. Please try again later.');
    }
  },

  // ? OBTENEMOS LOS GENEROS
  getGenres: async () => {
    try {
      const response = await axiosInstance.get('/genres');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw new Error('Failed to fetch genres. Please try again later.');
    }
  },


  // ? OBTENEMOS LAS ETIQUETAS
  getTags: async () => {
    try {
      const response = await axiosInstance.get('/tags');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags. Please try again later.');
    }
  },


  // ? OBTENEMOS LOS DESARROLLADORES
  getDevelopers: async () => {
    try {
      const response = await axiosInstance.get('/developers');
      return response.data.results;
    } catch (error) {
      console.error('Error fetching developers:', error);
      throw new Error('Failed to fetch developers. Please try again later.');
    }
  }
};

export default GameService;
