import React, { useState } from "react";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import {
  usePopularMovies,
  useSearchMovies,
  useMoviesByGenre,
} from "@/hooks/useMovies";
import { Film, AlertCircle } from "lucide-react";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const popularMovies = usePopularMovies();
  const searchMovies = useSearchMovies(searchQuery);
  const genreMovies = useMoviesByGenre(selectedGenre);

  let moviesData;
  if (selectedGenre) {
    moviesData = genreMovies;
  } else if (searchQuery.trim()) {
    moviesData = searchMovies;
  } else {
    moviesData = popularMovies;
  }

  const { movies, isLoading, error } = moviesData;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const getGenreName = (genreId) => {
    const genreMap = {
      1: "боевик",
      2: "комедия",
      3: "драма",
      4: "фантастика",
      5: "триллер",
      6: "криминал",
    };
    return genreMap[genreId] || "выбранный";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-primary">Mariman</span> Movies
          </h1>
          <p className="text-gray-400 mt-2">Поиск фильмов и рейтинги</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <div className="sm:w-48">
            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Ошибка загрузки
            </h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              {searchQuery.trim()
                ? `Результаты поиска: "${searchQuery}"`
                : selectedGenre
                  ? `Фильмы жанра: ${getGenreName(selectedGenre)}`
                  : "Популярные фильмы"}
            </h2>

            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie, index) => (
                  <MovieCard
                    key={movie?.id || `movie-${index}`}
                    movie={movie}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Film size={48} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Фильмы не найдены
                </h3>
                <p className="text-gray-400">
                  {selectedGenre
                    ? "Нет фильмов в этом жанре"
                    : searchQuery.trim()
                      ? "Попробуйте изменить поисковый запрос"
                      : "Скоро здесь появятся фильмы"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
