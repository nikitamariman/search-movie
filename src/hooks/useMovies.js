import { useState, useEffect, useCallback, useRef } from 'react'
import { kinopoiskAPI } from '@/services/api'

const useMovies = (fetchFunction) => {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const fetchFunctionRef = useRef(fetchFunction)
  
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction
  }, [fetchFunction])

  useEffect(() => {
    let isMounted = true

    const loadMovies = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchFunctionRef.current()
        if (isMounted) setMovies(data)
      } catch (err) {
        if (isMounted) setError(err.message || 'Ошибка загрузки')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadMovies()
  }, []) 

  return { movies, isLoading, error }
}

export const usePopularMovies = () => {
  return useMovies(kinopoiskAPI.getPopularMovies.bind(kinopoiskAPI))
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