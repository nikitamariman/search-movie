export const API_BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2'
export const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY 

export const ENDPOINTS = {
  POPULAR: '/films/top?type=TOP_250_BEST_FILMS&page=1',
  SEARCH: (query) => `/films?order=RATING&type=ALL&keyword=${encodeURIComponent(query)}&page=1`,
  MOVIE_DETAILS: (id) => `/films/${id}`,
}