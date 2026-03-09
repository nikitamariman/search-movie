import { useState, useEffect, useCallback } from 'react'
import { kinopoiskAPI } from '../services/api'

const useMovies = (fetchFunction) => {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const loadMovies = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchFunction()
        if (isMounted) setMovies(data || [])
      } catch (err) {
        if (isMounted) setError(err.message || 'Ошибка загрузки')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadMovies()
    return () => { isMounted = false }
  }, [fetchFunction])

  return { movies, isLoading, error }
}

export const usePopularMovies = () => {
  const fetchPopular = useCallback(() => {
    return kinopoiskAPI.getPopularMovies()
  }, [])
  return useMovies(fetchPopular)
}

export const useSearchMovies = (query) => {
  const searchFunction = useCallback(() => {
    return kinopoiskAPI.searchMovies(query)
  }, [query])
  return useMovies(searchFunction)
}

export const useMoviesByGenre = (genreId) => {
  const fetchFunction = useCallback(() => {
    if (!genreId) return Promise.resolve([])
    return kinopoiskAPI.getMoviesByGenre(genreId)
  }, [genreId])
  return useMovies(fetchFunction)
}

export default useMovies