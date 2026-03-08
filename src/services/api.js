import { API_BASE_URL, API_KEY } from '@/utils/constants'

class KinopoiskAPI {
  constructor() {
    this.baseUrl = API_BASE_URL
    this.headers = {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    }
  }

  async request(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  async getPopularMovies() {
    const data = await this.request('/films/top?type=TOP_250_BEST_FILMS&page=1')
    return (data.films || []).map(movie => ({
      id: movie.filmId,
      name: movie.nameRu,
      rating: { imdb: movie.ratingImdb || movie.ratingKinopoisk },
      poster: { url: movie.posterUrlPreview },
      year: movie.year
    }))
  }

  async searchMovies(query) {
    if (!query.trim()) return []
    const data = await this.request(`/films?keyword=${encodeURIComponent(query)}&page=1`)
    
    return (data.items || []).map(movie => ({
      id: movie.filmId,
      name: movie.nameRu,
      rating: { imdb: movie.ratingKinopoisk },
      poster: { url: movie.posterUrlPreview },
      year: movie.year
    }))
  }

  async getMovieDetails(id) {
    const [movieData, videosData] = await Promise.all([
      this.request(`/films/${id}`),
      this.request(`/films/${id}/videos`).catch(() => ({ items: [] }))
    ])
    
    return {
      id: movieData.filmId,
      name: movieData.nameRu,
      rating: { imdb: movieData.ratingKinopoisk },
      poster: { url: movieData.posterUrlPreview },
      year: movieData.year,
      description: movieData.description,
      genres: movieData.genres,
      videos: videosData.items || []
    }
  }

  async getGenres() {
    const data = await this.request('/films/filters')
    return data.genres || []
  }

  async getMoviesByGenre(genreId, page = 1) {
    const data = await this.request(`/films?genres=${genreId}&order=RATING&page=${page}`)
    
    return (data.items || []).map(movie => ({
      id: movie.filmId,
      name: movie.nameRu,
      rating: { imdb: movie.ratingKinopoisk },
      poster: { url: movie.posterUrlPreview },
      year: movie.year
    }))
  }
}

export const kinopoiskAPI = new KinopoiskAPI()