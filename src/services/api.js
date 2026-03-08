import { API_BASE_URL, API_KEY } from '@/utils/constants'
import { mockMovies, mockTrailers } from '@/data/mockMovies'

class KinopoiskAPI {
  constructor() {
    this.baseUrl = API_BASE_URL
    this.headers = {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    }
    this.apiAvailable = true
  }

  async request(endpoint) {
  try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers,
    })

    if (!response.ok) {
      if (response.status === 402) {
        this.apiAvailable = false
        throw new Error('API limit exceeded')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    this.apiAvailable = false
    throw error
  }
}

  async getPopularMovies() {
    if (!this.apiAvailable) {
      return mockMovies
    }

    try {
      const data = await this.request('/films/top?type=TOP_250_BEST_FILMS&page=1')
      return (data.films || []).map(movie => ({
        id: movie.filmId,
        name: movie.nameRu,
        rating: { imdb: movie.ratingImdb || movie.ratingKinopoisk },
        poster: { url: movie.posterUrlPreview },
        year: movie.year
      }))
    } catch {
      this.apiAvailable = false
      return mockMovies
    }
  }

  async searchMovies(query) {
    if (!query.trim()) return []
    
    if (!this.apiAvailable) {
      return mockMovies.filter(movie => 
        movie.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    try {
      const data = await this.request(`/films?keyword=${encodeURIComponent(query)}&page=1`)
      return (data.items || []).map(movie => ({
        id: movie.filmId,
        name: movie.nameRu,
        rating: { imdb: movie.ratingKinopoisk },
        poster: { url: movie.posterUrlPreview },
        year: movie.year
      }))
    } catch {
      this.apiAvailable = false
      return mockMovies.filter(movie => 
        movie.name.toLowerCase().includes(query.toLowerCase())
      )
    }
  }

  async getMovieDetails(id) {
    if (!this.apiAvailable) {
      const movie = mockMovies.find(m => m.id === Number(id))
      if (movie) {
        return {
          ...movie,
          videos: mockTrailers[id] || []
        }
      }
      throw new Error('Movie not found')
    }

    try {
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
    } catch {
      this.apiAvailable = false
      const movie = mockMovies.find(m => m.id === Number(id))
      if (movie) {
        return {
          ...movie,
          videos: mockTrailers[id] || []
        }
      }
      throw new Error('Movie not found')
    }
  }

  async getGenres() {
    if (!this.apiAvailable) {
      return [
        { id: 1, genre: "боевик" },
        { id: 2, genre: "комедия" },
        { id: 3, genre: "драма" },
        { id: 4, genre: "фантастика" },
        { id: 5, genre: "триллер" },
        { id: 6, genre: "криминал" }
      ]
    }

    try {
      const data = await this.request('/films/filters')
      return data.genres || []
    } catch {
      this.apiAvailable = false
      return [
        { id: 1, genre: "боевик" },
        { id: 2, genre: "комедия" },
        { id: 3, genre: "драма" },
        { id: 4, genre: "фантастика" },
        { id: 5, genre: "триллер" },
        { id: 6, genre: "криминал" }
      ]
    }
  }

  async getMoviesByGenre(genreId = 1) {
    if (!this.apiAvailable) {
      const genreMap = {
        "1": "боевик",
        "2": "комедия",
        "3": "драма",
        "4": "фантастика",
        "5": "триллер",
        "6": "криминал"
      }
      
      const genreName = genreMap[genreId]
      if (!genreName) return []
      
      const filtered = mockMovies.filter(movie => {
        return movie.genres.some(g => {
          if (typeof g === 'string') return g === genreName
          return g.genre === genreName
        })
      })
      
      return filtered
    }
    
    return []
  }
}

export const kinopoiskAPI = new KinopoiskAPI()